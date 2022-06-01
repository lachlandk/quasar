import { UFunc, NDArray } from "../core/index.js";
export function transpose(x1) {
    // assumes dtype float64
    return new NDArray(x1.shape.reverse(), "float64", x1.data.buffer, 0, x1.strides.reverse());
}
export const add = UFunc(function add(x1, x2) {
    return x1 + x2;
});
export const subtract = UFunc(function subtract(x1, x2) {
    return x1 - x2;
});
export const multiply = UFunc(function multiply(x1, x2) {
    return x1 * x2;
});
export const divide = UFunc(function divide(x1, x2) {
    return x1 / x2;
});
export const power = UFunc(function power(x1, x2) {
    return x1 ** x2;
});
export const mod = UFunc(function mod(x1, x2) {
    return x1 % x2;
});
export const reciprocal = UFunc(function reciprocal(x1) {
    return 1 / x1;
});
