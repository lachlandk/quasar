import { BinaryTreeNode } from "@lachlandk/trees";
export class AbstractNumber extends BinaryTreeNode {
    constructor() {
        if (new.target === AbstractNumber) {
            throw `Cannot construct AbstractNumber instances directly.`; // TODO: proper errors
        }
        super();
    }
    static parse(input) {
        const value = Number(input);
        if (!Number.isNaN(value)) {
            if (Number.isInteger(value)) {
                return new Integer(value);
            }
            else if (Number.isFinite(value)) {
                return new Float(value);
            }
            else {
                throw `Error: Infinite numbers not supported yet: ${value}`; // TODO: proper errors
            }
        }
        else {
            throw `Error: Input could not be parsed as a number: ${input}`; // TODO: proper errors
        }
    }
    toString() {
        throw `Error: toString() is not implemented for AbstractNumber.`; // TODO: proper errors
    }
}
export class Integer extends AbstractNumber {
    constructor(value) {
        super();
        if (typeof value === "string") {
            value = Number(value);
        }
        if (!Number.isNaN(value) && Number.isFinite(value)) {
            this.value = Math.trunc(value);
        }
        else {
            throw `Error: number could not be parsed as an integer: ${value}`; // TODO: proper errors
        }
    }
    toString() {
        return this.value.toString();
    }
}
export class Float extends AbstractNumber {
    constructor(value) {
        super();
        if (typeof value === "string") {
            value = Number(value);
        }
        if (!Number.isNaN(value) && Number.isFinite(value)) {
            this.value = value;
        }
        else {
            throw `Error: number could not be parsed as a float: ${value}`; // TODO: proper errors
        }
    }
    toString() {
        return this.value.toString();
    }
}
