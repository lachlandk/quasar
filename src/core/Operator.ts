import { BinaryTreeNode } from "@lachlandk/trees";

export class Operator extends BinaryTreeNode {
    associativity: "left" | "right"
    precedence: number

    constructor(left: BinaryTreeNode, right: BinaryTreeNode, associativity: string, precedence: number) {
        super();
        this.left = left;
        this.right = right;
        if (associativity === "left") {
            this.associativity = "left";
        } else if (associativity === "right") {
            this.associativity = "right";
        } else {
            throw `Error: associativity not "left" or "right": ${associativity}`; // TODO: proper error
        }
        this.precedence = precedence;
    }

}

export class Pow extends Operator {
    constructor(left: BinaryTreeNode, right: BinaryTreeNode) {
        super(left, right, "right", 1);
    }

    toString(): string {
        return "^";
    }
}

export class Mul extends Operator {
    constructor(left: BinaryTreeNode, right: BinaryTreeNode) {
        super(left, right, "left", 2);
    }

    toString(): string {
        return "*";
    }
}

export class Add extends Operator {
    // https://github.com/sympy/sympy/blob/master/sympy/core/add.py

    constructor(left: BinaryTreeNode, right: BinaryTreeNode) {
        super(left, right, "left", 3);
    }

    toString(): string {
        return "+";
    }
}
