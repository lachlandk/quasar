import { IndexError, ValueError } from "./errors.js";

type dtype = "float64"

export class ndarray {
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

        if (!shape.every(size => Number.isInteger(size))) throw new ValueError("Size of array dimensions are not integers", shape);
        if (Array.isArray(strides) && !strides.every(stride => Number.isInteger(stride / this.itemSize))) throw new ValueError("Size of array strides are not integer multiples of itemSize", strides);
        if (!Number.isInteger(offset / this.itemSize)) throw new ValueError("Array offset is not multiple of itemSize", offset);

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

        return new Proxy(this, {  // TODO: return types for this aren't working
            get(target, prop) {
                if (typeof prop === "string" && /\d+/.test(prop)) {
                    const axes = prop.split(",");
                    if (axes.some(ax => /:/.test(ax) || !/\d/.test(ax))) {
                        const slices: string[][] = axes.map(ax => ax.split(":"));
                        if (slices.every(slice => slice.length <= 3)) {
                            const indices = slices.map((slice, i) => {
                                return [
                                    /\S/.test(slice[0]) ? Number(slice[0]) : 0,
                                    slice[1] !== undefined && /\S/.test(slice[1]) ? Number(slice[1]) : /\S/.test(slice[0]) && slice[1] === undefined ? Number(slice[0]) + 1 : target.shape[i],
                                    slice[2] !== undefined && /\S/.test(slice[2]) ? Number(slice[2]) : 1
                                ];
                            });
                            return target.slice(...indices as [number, number, number][]);
                        }
                    } else {
                        const indices = axes.map(ax => Number(ax));
                        return target.get(...indices);
                    }
                }
                return target[prop];
            },

            set(target, prop, value) {
                if (typeof prop === "string" && /\d+/.test(prop)) {
                    const indices = prop.split(",").map(ax => Number(ax));
                    target.set(value, ...indices);
                    return true;
                }
                return false;
            }
        });
    }

    *[Symbol.iterator]() {
        function* iterate(this: ndarray, axis: number, ...indices: number[]): Generator {
            if (axis === this.shape.length - 1) {
                for (let i=0; i<this.shape[axis]; i++) {
                    yield this.get(...indices, i);
                }
            } else {
                indices.push(0);
                for (let i=0; i<this.shape[axis]; i++) {
                    yield* iterate.call(this,axis + 1, ...indices);
                    indices[axis] += 1;
                }
            }
        }
        yield* iterate.call(this,0);
    }

    get(...indices: number[]): number | ndarray {
        for (let i=0; i<this.dimension; i++) {
            if (indices[i] >= this.shape[i]) throw new IndexError(indices[i], i, this.shape[i]);
        }
        if (indices.length === this.dimension) {
            return this.data.getFloat64(this.strides.reduce((acc, curr, i) => acc + curr * indices[i], 0));
        } else if (indices.length < this.dimension) {
            const offset = indices.reduce((acc, curr, i) => acc + curr * this.strides[i], 0);
            return new ndarray(this.shape.slice(indices.length), "float64", this.data.buffer, offset, this.strides.slice(indices.length));
        } else {
            throw new ValueError(`Too many indices passed for array of dimension ${this.dimension}`, indices.length);
        }
    }

    set(value: number, ...indices: number[]) {
        if (indices.length !== this.dimension) {
            throw new ValueError(`Incorrect number of indices passed for array of dimension ${this.dimension}`, indices.length);
        }
        for (let i=0; i<this.dimension; i++) {
            if (indices[i] >= this.shape[i]) throw new IndexError(indices[i], i, this.shape[i]);
        }
        this.data.setFloat64(this.strides.reduce((acc, curr, i) => acc + curr * indices[i], 0), value);
    }

    slice(...slices: [number, number, number][]): ndarray {  // [start, end, step]
        if (slices.length > this.dimension) throw new ValueError(`Too many slices passed for array of dimension ${this.dimension}`, slices.length);

        // check that passed indices are valid
        slices.forEach((ax, i) => {
            if (!(Number.isInteger(ax[0]) && Number.isInteger(ax[1]) && Number.isInteger(ax[2]))) throw new ValueError("Indices must be integers", ax);
            if (ax[0] < 0) ax[0] += this.shape[i];
            if (ax[1] < 0) ax[1] += this.shape[i];
            if (ax[0] >= this.shape[i]) throw new IndexError(ax[0], i, this.shape[i]);
            if (ax[1] >= this.shape[i]) throw new IndexError(ax[1], i, this.shape[i]);
            if (ax[1] <= ax[0]) throw new ValueError(`Stop index cannot be lower than or equal to start index ${ax[0]}`, ax[1]);
            if (ax[2] === 0) throw new ValueError("Step cannot be 0", ax[2]);
            if (ax[2] < 0) throw new ValueError("Negative step not currently supported", ax[2]);  // TODO: allow negative step
        });

        // pad out slices list
        for (let i=slices.length; i<this.shape.length; i++) {
            slices.push([0, this.shape[i], 1]);
        }

        // set shape and strides
        const shape = [...this.shape];
        const strides = [...this.strides];  // strides don't change unless step is different
        for (let i=0; i<strides.length; i++) {
            strides[i] *= slices[i][2];
            shape[i] = Math.ceil((slices[i][1] - slices[i][0]) / (slices[i][2]));
        }

        // set initial offset
        const offset = this.data.byteOffset + slices.reduce((acc, curr, i) => {
            return acc + (curr[0] * this.strides[i]);
        }, 0);

        if (shape[0] === 1) {
            shape.shift();
            strides.shift();
        }

        // return view
        return new ndarray(shape, "float64", this.data.buffer, offset, strides);
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

    forEach(callback: (element: number, indices: number[], array: ndarray) => void): void {
        const iterate = (axis: number, ...indices: number[]) => {
            if (axis === this.shape.length - 1) {
                for (let i = 0; i < this.shape[axis]; i++) {
                    callback(this.get(...indices, i) as number, [...indices, i], this);
                }
            } else {
                indices.push(0);
                for (let i = 0; i < this.shape[axis]; i++) {
                    iterate(axis + 1, ...indices);
                    indices[axis] += 1;
                }
            }
        }
        iterate(0);
    }
}
