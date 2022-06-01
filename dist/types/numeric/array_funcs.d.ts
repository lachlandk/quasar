import { NDArray } from "../core/index.js";
declare type nestedArray = (number | nestedArray)[];
export declare function array(array: nestedArray): NDArray;
export declare function arange(stop: number): NDArray;
export declare function arange(start: number, stop: number, step?: number): NDArray;
export declare function linspace(start: number, stop: number, num?: number): NDArray;
export {};
