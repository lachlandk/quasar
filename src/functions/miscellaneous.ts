import { UFunc, NDArray } from "../core/index.js";

export const abs: (x: NDArray) => NDArray = UFunc(function abs(x: number) {
    return Math.abs(x);
});

export const sign: (x: NDArray) => NDArray = UFunc(function sign(x: number) {
    return Math.sign(x);
});

export const sqrt: (x: NDArray) => NDArray = UFunc(function sqrt(x: number) {
    return Math.sqrt(x);
});

export const cbrt: (x: NDArray) => NDArray = UFunc(function cbrt(x: number) {
    return Math.cbrt(x);
});

export const max: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function max(x1: number, x2: number) {
    return Math.max(x1, x2);
});

export const min: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function min(x1: number, x2: number) {
    return Math.min(x1, x2);
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
