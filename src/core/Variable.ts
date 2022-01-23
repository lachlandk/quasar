import { BinaryTreeNode } from "@lachlandk/trees";

export class Variable extends BinaryTreeNode {
    symbol: string

    constructor(symbol: string) {
        super();

        // TODO: more complex parsing
        this.symbol = symbol
    }

    toString(): string {
        return this.symbol
    }
}
