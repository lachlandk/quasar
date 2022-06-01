import { UFunc } from "../core/index.js";
export const abs = UFunc(function abs(x) {
    return Math.abs(x);
});
export const sign = UFunc(function sign(x) {
    return Math.sign(x);
});
export const sqrt = UFunc(function sqrt(x) {
    return Math.sqrt(x);
});
export const cbrt = UFunc(function cbrt(x) {
    return Math.cbrt(x);
});
export const max = UFunc(function max(x1, x2) {
    return Math.max(x1, x2);
});
export const min = UFunc(function min(x1, x2) {
    return Math.min(x1, x2);
});
export const round = UFunc(function round(x1) {
    return Math.round(x1);
});
export const ceil = UFunc(function ceil(x1) {
    return Math.ceil(x1);
});
export const floor = UFunc(function floor(x1) {
    return Math.floor(x1);
});
