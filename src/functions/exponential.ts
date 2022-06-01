import { UFunc, NDArray } from "../core/index.js";

export const exp: (x: NDArray) => NDArray = UFunc(function exp(x: number) {
    return Math.exp(x);
});

export const expm1: (x: NDArray) => NDArray = UFunc(function expm1(x: number) {
    return Math.expm1(x);
});

export const log: (x: NDArray) => NDArray = UFunc(function log(x: number) {
    return Math.log(x);
});

export const log10: (x: NDArray) => NDArray = UFunc(function log10(x: number) {
    return Math.log10(x);
});

export const log2: (x: NDArray) => NDArray = UFunc(function log2(x: number) {
    return Math.log2(x);
});

export const log1p: (x: NDArray) => NDArray = UFunc(function log1p(x: number) {
    return Math.log1p(x);
});
