type dtype = "float64"

export class NDArray {
    [key: string | symbol]: unknown;

    data: DataView
    dtype: dtype
    size: number
    itemSize: number
    byteLength: number
    dimension: number
    shape: number[]
    strides: number[]

    constructor(shape: number[],
                dtype: dtype = "float64",
                buffer: ArrayBuffer | undefined = undefined,
                offset: number = 0,
                strides: number[] = []) {

        this.dtype = dtype;
        this.itemSize = 8;  // float64

        if (!shape.every(size => Number.isInteger(size))) throw `Error: Size of array dimensions must be integer`;  // TODO: proper errors
        if (Array.isArray(strides) && !strides.every(stride => Number.isInteger(stride / this.itemSize))) throw `Error: Size of array strides must be integer multiple of itemSize`;
        if (!Number.isInteger(offset / this.itemSize)) throw `Error: Array offset must be multiple of itemSize`;

        // calculate data size and dimension
        this.shape = shape;
        this.size = this.shape.reduce((acc, curr) => acc * curr);
        this.byteLength = this.size * this.itemSize;
        this.dimension = this.shape.length;

        // initialise buffer
        if (buffer === undefined) {
            buffer = new ArrayBuffer(this.byteLength);
        }
        this.data = new DataView(buffer, offset);

        // calculate strides or check given strides valid
        if (strides.length === 0) {
            this.strides = this.shape.map((_, i) => this.shape.slice(i + 1).reduce((acc, curr) => acc * curr, this.itemSize));
        } else {
            this.strides = strides;
        }

        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop === "string" && /\d+/.test(prop)) {
                    const axes = prop.split(",");
                    if (axes.length <= target.dimension) {  // implement recursive definition instead of this?
                        if (/:/.test(prop)) {
                            const slices: (string | number)[][] = axes.map(ax => ax.split(":"));
                            if (slices.every(slice => slice.length <= 3)) {
                                for (let i=0; i<slices.length; i++) {
                                    slices[i][0] = slices[i][0] === "" ? 0 : Number(slices[i][0]);
                                    if (slices[i][0] && slices[i][1] === undefined) throw `Error: Extracting single subarray not supported yet`;
                                    slices[i][1] = slices[i][1] === "" || slices[i][1] === undefined ? target.shape[i] : Number(slices[i][1]);
                                    slices[i][2] = slices[i][2] === "" || slices[i][2] === undefined ? 1 : Number(slices[i][2]);
                                }
                                return target.slice(...slices as [number, number, number][]);
                            }
                        } else {
                            const indices = axes.map(ax => Number(ax));
                            return target.get(...indices);
                        }
                    }
                }
                return target[prop];
            },

            set(target, prop, value) {
                if (typeof prop === "string" && /\d+/.test(prop)) {
                    const axes = prop.split(",");
                    if (axes.length <= target.dimension) {
                        const indices = axes.map(ax => Number(ax));
                        target.set(value, ...indices);
                        return true;
                    }
                }
                return false;
            }
        });
    }

    get(...indices: number[]): number | NDArray {
        if (indices.length === this.dimension) {
            return this.data.getFloat64(this.strides.reduce((acc, curr, i) => acc + curr * indices[i], 0));
        } else if (indices.length < this.dimension) {
            console.log(indices);
            const offset = indices.reduce((acc, curr, i) => acc + curr * this.strides[i], 0);
            return new NDArray(this.shape.slice(indices.length), "float64", this.data.buffer, offset, this.strides.slice(indices.length));
        } else {
            throw `Error: Too many indices passed for array of dimension ${this.dimension}`;
        }
    }

    set(value: number, ...indices: number[]) {
        if (indices.length !== this.dimension) {
            throw `Error: Incorrect number of indices passed for array of dimension ${this.dimension}`;
        }
        this.data.setFloat64(this.strides.reduce((acc, curr, i) => acc + curr * indices[i], 0), value);
    }

    slice(...axes: [number, number, number][]): NDArray {  // [start, end, step]

        // check that passed indices are valid
        axes.forEach((ax, i) => {
            if (!(Number.isInteger(ax[0]) && Number.isInteger(ax[1]) && Number.isInteger(ax[2]))) throw `Error: Indices must be integers`;
            if (ax[0] < 0) ax[0] += this.shape[i];
            if (ax[1] < 0) ax[1] += this.shape[i];
            if (!(ax[0] < this.shape[i] && ax[1] <= this.shape[i])) throw `Error: Index out of bounds`;
            if (ax[1] <= ax[0]) throw `Error: stop index cannot be higher than or equal to start index`;
            if (ax[2] === 0) throw `Error: step cannot be 0`;
            if (ax[2] < 0) throw `Error: Negative step not currently supported`;
        });

        // pad out axes list
        for (let i=axes.length; i<this.shape.length; i++) {
            axes.push([0, this.shape[i], 1]);
        }

        // set shape and strides
        const shape = [...this.shape];
        const strides = [...this.strides];  // strides don't change unless step is different
        for (let i=0; i<strides.length; i++) {
            strides[i] *= axes[i][2];
            shape[i] = Math.ceil((axes[i][1] - axes[i][0]) / (axes[i][2]));
        }

        // set initial offset
        const offset = axes.reduce((acc, curr, i) => {
            return acc + (curr[0] * this.strides[i]);
        }, 0);

        // return view
        return new NDArray(shape, "float64", this.data.buffer, offset, strides);
    }

    transpose() {
        return new NDArray(this.shape.reverse(), "float64", this.data.buffer, 0, this.strides.reverse());
    }

    toString(): string {
        const currentIndex = new Array(this.dimension);  // keeps track of indices that have been written
        currentIndex.fill(0);
        const arrayToString = (axis: number): string => {
            let string = "[";
            currentIndex[axis] = 0;  // reset counter on current axis
            if (axis === this.dimension - 1) {
                for (let i=0; i<this.shape[axis] - 1; i++) {
                    string += this.get(...currentIndex);
                    string += ", ";
                    currentIndex[axis] += 1;
                }
                string += this.get(...currentIndex);
            } else {
                for (let i=0; i<this.shape[axis] - 1; i++) {
                    string += arrayToString(axis + 1);
                    string += ",\n";
                    string += " ".repeat(axis + 1);
                    currentIndex[axis] += 1;
                }
                string += arrayToString(axis + 1);
            }
            string += "]";
            return string;
        }
        return arrayToString(0);
    }
}
