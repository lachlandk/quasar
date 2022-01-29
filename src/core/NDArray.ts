type dtype = "float64"

export class NDArray {
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

        if (!shape.every((size) => Number.isInteger(size))) throw `Error: Size of array dimensions must be integer`;  // TODO: proper errors
        if (Array.isArray(strides) && !strides.every((stride) => Number.isInteger(stride))) throw `Error: Size of array strides must be integer`;
        if (!Number.isInteger(offset / this.itemSize)) throw `Error: Array offset multiple of itemSize`;

        // calculate data size and dimension
        this.shape = shape;
        this.size = this.shape.reduce((acc, curr) => acc * curr);
        this.byteLength = this.size * this.itemSize;
        this.dimension = this.shape.length;

        // initialise buffer or check shape is compatible
        if (buffer === undefined) {
            buffer = new ArrayBuffer(this.byteLength);
        } else if (!Number.isInteger(buffer.byteLength / this.byteLength)) {
            throw `Error: Incompatible shape for array of this length`;
        }
        this.data = new DataView(buffer, offset);

        // calculate strides or check given strides valid
        if (strides.length === 0) {
            this.strides = this.shape.map((_, i) => this.shape.slice(i + 1).reduce((acc, curr) => acc * curr, this.itemSize));
        } else {
            const baseStrides = this.shape.map((_, i) => this.shape.slice(i + 1).reduce((acc, curr) => acc * curr, this.itemSize));
            if (strides.every((stride, i) => Number.isInteger(stride / baseStrides[i]))) {
                this.strides = strides;
            } else {
                throw `Error: Incompatible stride lengths for array of this shape`;
            }
        }

        return new Proxy(this, {

        });
    }

    get(...indices: number[]): number {
        return this.data.getFloat64(this.strides.reduce((acc, curr, i) => acc + curr * indices[i], 0));
    }

    set(value: number, ...indices: number[]) {
        this.data.setFloat64(this.strides.reduce((acc, curr, i) => acc + curr * indices[i], 0), value);
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
                if (this.shape[axis] > 1) {
                    for (let i=0; i<this.shape[axis] - 1; i++) {
                        string += arrayToString(axis + 1);
                        string += ",\n";
                        string += " ".repeat(axis + 1);
                        currentIndex[axis] += 1;
                    }
                    string += arrayToString(axis + 1);
                }
            }
            string += "]";
            return string;
        }
        return arrayToString(0);
    }
}
