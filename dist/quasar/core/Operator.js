import { BinaryTreeNode } from "@lachlandk/trees";
export class Operator extends BinaryTreeNode {
    constructor(left, right, associativity, precedence) {
        super();
        this.left = left;
        this.right = right;
        if (associativity === "left") {
            this.associativity = "left";
        }
        else if (associativity === "right") {
            this.associativity = "right";
        }
        else {
            throw `Error: associativity not "left" or "right": ${associativity}`; // TODO: proper error
        }
        this.precedence = precedence;
    }
}
export class Pow extends Operator {
    constructor(left, right) {
        super(left, right, "right", 1);
    }
    toString() {
        return "^";
    }
}
export class Mul extends Operator {
    constructor(left, right) {
        super(left, right, "left", 2);
    }
    toString() {
        return "*";
    }
}
export class Add extends Operator {
    // https://github.com/sympy/sympy/blob/master/sympy/core/add.py
    constructor(left, right) {
        super(left, right, "left", 3);
    }
    toString() {
        return "+";
    }
}
