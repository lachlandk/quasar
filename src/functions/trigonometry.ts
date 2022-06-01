import { UFunc, NDArray } from "../core/index.js";

export const sin: (x: NDArray) => NDArray = UFunc(function sin(x: number) {
    return Math.sin(x);
});

export const cos: (x: NDArray) => NDArray = UFunc(function cos(x: number) {
    return Math.cos(x);
});

export const tan: (x: NDArray) => NDArray = UFunc(function tan(x: number) {
    return Math.tan(x);
});

export const arcsin: (x: NDArray) => NDArray = UFunc(function arcsin(x: number) {
    return Math.asin(x);
});

export const arccos: (x: NDArray) => NDArray = UFunc(function arccos(x: number) {
    return Math.acos(x);
});

export const arctan: (x: NDArray) => NDArray = UFunc(function arctan(x: number) {
    return Math.atan(x);
});

export const arctan2: (x1: NDArray, x2: NDArray) => NDArray = UFunc(function arctan2(x1: number, x2: number) {
    return Math.atan2(x1, x2);
});

export const hypot: (...values: NDArray[]) => NDArray = UFunc(function hypot(...values: number[]) {
    return Math.hypot(...values);
});
