import { ufunc, ndarray } from "../core/index.js";

export function transpose(x1: ndarray): ndarray {
    // assumes dtype float64
    return new ndarray(x1.shape.reverse(), "float64", x1.data.buffer, 0, x1.strides.reverse());
}

export const add: (x1: ndarray, x2: ndarray) => ndarray = ufunc(function add(x1: number, x2: number) {
    return x1 + x2;
});

export const subtract: (x1: ndarray, x2: ndarray) => ndarray = ufunc(function subtract(x1: number, x2: number) {
    return x1 - x2;
});

export const multiply: (x1: ndarray, x2: ndarray) => ndarray = ufunc(function multiply(x1: number, x2: number) {
    return x1 * x2;
});

export const divide: (x1: ndarray, x2: ndarray) => ndarray = ufunc(function divide(x1: number, x2: number) {
    return x1 / x2;
});

export const power: (x1: ndarray, x2: ndarray) => ndarray = ufunc(function power(x1: number, x2: number) {
    return x1 ** x2;
});

export const mod: (x1: ndarray, x2: ndarray) => ndarray = ufunc(function mod(x1: number, x2: number) {
    return x1 % x2;
});

export const reciprocal: (x1: ndarray) => ndarray = ufunc(function reciprocal(x1: number) {
    return 1 / x1;
});
