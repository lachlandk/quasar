declare type dtype = "float64";
export declare class NDArray {
    [key: string | symbol]: unknown;
    data: DataView;
    dtype: dtype;
    size: number;
    itemSize: number;
    byteLength: number;
    dimension: number;
    shape: number[];
    strides: number[];
    constructor(shape: number[], dtype?: dtype, buffer?: ArrayBuffer | undefined, offset?: number, strides?: number[]);
    [Symbol.iterator](): Generator<unknown, void, unknown>;
    get(...indices: number[]): number | NDArray;
    set(value: number, ...indices: number[]): void;
    slice(...slices: [number, number, number][]): NDArray;
    toString(): string;
    forEach(callback: (element: number, indices: number[], array: NDArray) => void): void;
}
export {};
