import { BinaryTreeNode } from "@lachlandk/trees";
export declare class AbstractNumber extends BinaryTreeNode {
    constructor();
    static parse(input: string): Integer | Float;
    toString(): void;
}
export declare class Integer extends AbstractNumber {
    value: number;
    constructor(value: string | number);
    toString(): string;
}
export declare class Float extends AbstractNumber {
    value: number;
    constructor(value: string | number);
    toString(): string;
}
