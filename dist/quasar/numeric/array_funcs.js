import { NDArray } from "../core/index.js";
export function array(array) {
    const getDimensions = (array) => {
        if (Array.isArray(array)) {
            const lengths = getDimensions(array[0]);
            if (lengths === false) {
                return false;
            }
            else {
                for (const subArray of array) {
                    const otherLengths = getDimensions(subArray);
                    if (otherLengths === false || lengths.join() !== otherLengths.join()) {
                        return false;
                    }
                }
                return [array.length].concat(lengths);
            }
        }
        else {
            return [];
        }
    };
    const dimensions = getDimensions(array);
    if (dimensions) {
        const ndArray = new NDArray(dimensions, "float64");
        const flat = array.flat(dimensions.length);
        const copy = (axis, ...indices) => {
            if (axis === dimensions.length - 1) {
                for (let i = 0; i < dimensions[axis]; i++) {
                    const index = [...indices, i];
                    const value = flat[index.reduce((acc, curr, i) => acc + curr * dimensions.slice(i + 1).reduce((acc, curr) => acc * curr, 1), 0)];
                    ndArray.set(value, ...index);
                }
            }
            else {
                indices.push(0);
                for (let i = 0; i < dimensions[axis]; i++) {
                    copy(axis + 1, ...indices);
                    indices[axis] += 1;
                }
            }
        };
        copy(0);
        return ndArray;
    }
    else {
        throw `Error: Creating NDArray from jagged array not supported.`;
    }
}
export function arange(startOrStop, stop, step) {
    const start = stop === undefined ? 0 : startOrStop;
    stop = stop === undefined ? startOrStop : stop;
    step = step === undefined ? 1 : step;
    // step = dtype(start + step) - dtype(start)
    const length = Math.ceil((stop - start) / step);
    const array = new NDArray([length], "float64");
    let value = start;
    for (let i = 0; i < length; i++) {
        array.set(value, i);
        value += step;
    }
    return array;
}
export function linspace(start, stop, num = 50) {
    // TODO: update this to use the NumPy algorithm once broadcasting is implemented
    const array = new NDArray([num], "float64");
    const step = (stop - start) / (num - 1);
    let value = start;
    for (let i = 0; i < num; i++) {
        array.set(value, i);
        value += step;
    }
    return array;
}
