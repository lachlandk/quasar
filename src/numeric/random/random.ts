import { NDArray } from "../../core/index.js";

export function random(size?: number[]) {
    if (size === undefined) {
        return Math.random();
    } else {
        const array = new NDArray(size);
        array.forEach(function (element, indices) {
            array.set(Math.random(), ...indices);
        });
        return array;
    }
}

export function uniform(min: number = 0, max: number = 1, size?: number[]) {
    // p(x) = { 1 / (max - min) for x in [min, max), 0 otherwise
    min = min === undefined ? 0 : min;
    max = max === undefined ? 1 : max;
    if (size === undefined) {
        return Math.random() * (max - min) + min;
    } else {
        const array = new NDArray(size);
        array.forEach(function (element, indices) {
            array.set(Math.random() * (max - min) + min, ...indices);
        });
        return array;
    }
}

// export function randint(max: number, size?: number[]): number | NDArray
// export function randint(min: number, max: number, size?: number[]): number | NDArray
// export function randint(minOrMax: number, maxOrSize?: number | number[], size?: number[]) {
export function randint(min: number = 0, max: number = 1, size?: number[]) {
    if (size === undefined) {
        return Math.floor(Math.random() * (max - min) + min);
    } else {
        const array = new NDArray(size);
        array.forEach(function (element, indices) {
            array.set(Math.floor(Math.random() * (max - min) + min), ...indices);
        });
        return array;
    }
}
