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
