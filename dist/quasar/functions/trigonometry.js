import { UFunc } from "../core/index.js";
export const sin = UFunc(function sin(x) {
    return Math.sin(x);
});
export const cos = UFunc(function cos(x) {
    return Math.cos(x);
});
export const tan = UFunc(function tan(x) {
    return Math.tan(x);
});
export const arcsin = UFunc(function arcsin(x) {
    return Math.asin(x);
});
export const arccos = UFunc(function arccos(x) {
    return Math.acos(x);
});
export const arctan = UFunc(function arctan(x) {
    return Math.atan(x);
});
export const arctan2 = UFunc(function arctan2(x1, x2) {
    return Math.atan2(x1, x2);
});
export const hypot = UFunc(function hypot(...values) {
    return Math.hypot(...values);
});
