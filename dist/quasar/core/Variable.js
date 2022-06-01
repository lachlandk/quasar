import { BinaryTreeNode } from "@lachlandk/trees";
export class Variable extends BinaryTreeNode {
    constructor(symbol) {
        super();
        // TODO: more complex parsing
        this.symbol = symbol;
    }
    toString() {
        return this.symbol;
    }
}
