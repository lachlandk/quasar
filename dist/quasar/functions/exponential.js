import { UFunc } from "../core/index.js";
export const exp = UFunc(function exp(x) {
    return Math.exp(x);
});
export const expm1 = UFunc(function expm1(x) {
    return Math.expm1(x);
});
export const log = UFunc(function log(x) {
    return Math.log(x);
});
export const log10 = UFunc(function log10(x) {
    return Math.log10(x);
});
export const log2 = UFunc(function log2(x) {
    return Math.log2(x);
});
export const log1p = UFunc(function log1p(x) {
    return Math.log1p(x);
});
