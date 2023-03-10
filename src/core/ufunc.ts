import { ndarray } from "./ndarray";

export const ufunc = function UFunc(func: Function) {
    return function (...arrays: ndarray[]): ndarray {
        // assuming input arrays are the same shape
        const output = new ndarray(arrays[0].shape);

        function iterate(axis: number, ...indices: number[]): void {
            if (axis === output.shape.length - 1) {
                for (let i=0; i<output.shape[axis]; i++) {
                    const args = arrays.map(array => array.get(...indices, i));
                    const value = func(...args);
                    output.set(value, ...indices, i);
                }
            } else {
                indices.push(0);
                for (let i=0; i<output.shape[axis]; i++) {
                    iterate(axis + 1, ...indices);
                    indices[axis] += 1;
                }
            }
        }
        iterate(0);
        return output;
    }
}
