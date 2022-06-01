import { BinaryTreeNode } from "@lachlandk/trees";
export declare class Operator extends BinaryTreeNode {
    associativity: "left" | "right";
    precedence: number;
    constructor(left: BinaryTreeNode, right: BinaryTreeNode, associativity: string, precedence: number);
}
export declare class Pow extends Operator {
    constructor(left: BinaryTreeNode, right: BinaryTreeNode);
    toString(): string;
}
export declare class Mul extends Operator {
    constructor(left: BinaryTreeNode, right: BinaryTreeNode);
    toString(): string;
}
export declare class Add extends Operator {
    constructor(left: BinaryTreeNode, right: BinaryTreeNode);
    toString(): string;
}
