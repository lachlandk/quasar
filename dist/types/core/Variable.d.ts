import { BinaryTreeNode } from "@lachlandk/trees";
export declare class Variable extends BinaryTreeNode {
    symbol: string;
    constructor(symbol: string);
    toString(): string;
}
