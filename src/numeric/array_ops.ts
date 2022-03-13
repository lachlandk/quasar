import { UFunc, NDArray } from "../core/index.js";

export function transpose(x1: NDArray): NDArray {
    // assumes dtype float64
    return new NDArray(x1.shape.reverse(), "float64", x1.data.buffer, 0, x1.strides.reverse());
}

export const add: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function add(x1: number, x2: number) {
    return x1 + x2;
});

export const subtract: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function subtract(x1: number, x2: number) {
    return x1 - x2;
});

export const multiply: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function multiply(x1: number, x2: number) {
    return x1 * x2;
});

export const divide: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function divide(x1: number, x2: number) {
    return x1 / x2;
});

export const power: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function power(x1: number, x2: number) {
    return x1 ** x2;
});

export const mod: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function mod(x1: number, x2: number) {
    return x1 % x2;
});

export const reciprocal: (x1: NDArray) => NDArray = UFunc(function reciprocal(x1: number) {
    return 1 / x1;
});

export const round: (x1: NDArray) => NDArray = UFunc(function round(x1: number) {
    return Math.round(x1);
});

export const ceil: (x1: NDArray) => NDArray = UFunc(function ceil(x1: number) {
    return Math.ceil(x1);
});

export const floor: (x1: NDArray) => NDArray = UFunc(function floor(x1: number) {
    return Math.floor(x1);
});
