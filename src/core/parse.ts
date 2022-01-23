import { Expression } from "./Expression.js";
import { AbstractNumber } from "./Number.js";
import { Variable } from "./Variable.js";
import { Pow, Mul, Add } from "./Operator.js";
import { BinaryTreeNode } from "@lachlandk/trees";

export function parse(input: string) {
    // this function describes the process of parsing a human-written mathematical expression to a binary tree data structure
    // as the algorithm progresses, we see the transition from chaos to order

    type numberToken = {
        type: "number" | "variable"
        value: string
    }
    type parenToken = {
        type: "open" | "close"
        value: string
    }
    type operatorToken = {
        type: "operator"
        value: string
        associativity: "left" | "right"
        precedence: number
    }
    type token = numberToken | parenToken | operatorToken

    const expression = new Expression();

    // lexical analysis
    const lexemes = input.match(/\d+|\S/ig); // TODO include functions, variables like x_0
    const tokens: token[] = [];
    if (lexemes === null) {
        return expression;
    }
    lexemes.forEach(function(lexeme) {
        if (lexeme.match(/\d+/)) {
            tokens.push({type: "number", value: lexeme});
        } else if (lexeme.match(/[a-z]/i)) {
            tokens.push({type: "variable", value: lexeme});
        } else if (lexeme.match(/[+*/^-]/)) {
            if (lexeme.match(/[\^]/)){
                tokens.push({type: "operator", value: lexeme, associativity: "right", precedence: 1});
            } else if (lexeme.match(/[/*]/)) {
                tokens.push({type: "operator", value: lexeme, associativity: "left", precedence: 2});
            } else if (lexeme.match(/[+-]/)) {
                tokens.push({type: "operator", value: lexeme, associativity: "left",   precedence: 3});
            }
        } else if (lexeme.match(/\(/)) {
            tokens.push({type: "open", value: lexeme});
        } else if (lexeme.match(/\)/)) {
            tokens.push({type: "close", value: lexeme});
        } else {
            throw {name: "LexingError", msg: "Unknown Token: " + lexeme};
        }
    });

    // special cases
    // TODO: convert / with numbers to rational number
    for (let i=0; i<tokens.length; i++) {
        let currentToken = tokens[i];
        // if a variable, number or open parenthesis is preceded by a variable, number or close parenthesis 
        if (i !== 0 && (currentToken.type === "variable" || currentToken.type === "number" || currentToken.type === "open")) {
            if (tokens[i-1].type === "variable" || tokens[i-1].type === "number" || tokens[i-1].type === "close") {
                tokens.splice(i, 0, {type: "operator", value: "*", associativity: "left", precedence: 2})
            }
        } else if (currentToken.type === "operator") {
            // double negative
            if (currentToken.value === "-" && tokens[i+1] && tokens[i+1].value === "-") {
                currentToken.value = "+";
                tokens.splice(i + 1, 1);
            }
            // remove unary +
            if (currentToken.value === "+" && (i === 0 || tokens[i-1].type === "operator" || tokens[i-1].type === "open")) {
                tokens.splice(i, 1);
            }
            // missing operands
            // TODO: proper errors
            if (currentToken.value.match(/[/*+^-]/) && ((tokens[i-1] && tokens[i-1].type === "operator") || !tokens[i-1] || !tokens[i+1])) {
                throw {name: "ParsingError", msg: "Invalid operands for operator: " + currentToken.value};
                // TODO: not working "x(x+)"
            }
        }
    }

    // shunting-yard algorithm, converts array of tokens in infix notation into array of tokens in postfix notation
    // https://en.wikipedia.org/wiki/Shunting-yard_algorithm
    const output: token[] = []; // output queue
    const stack: (parenToken | operatorToken)[]  = []; // operator stack
    while (tokens.length !== 0) {
        const token = tokens.shift()!;
        if (token.type === "number" || token.type === "variable") {
            output.push(token);
        } else if (token.type === "operator") {
            while (stack.length !== 0 && stack[0].type === "operator" && (stack[0].precedence < token.precedence || (token.associativity === "left" && stack[0].precedence <= token.precedence))) {
                output.push(stack.shift()!);
            }
            stack.unshift(token);
        } else if (token.type === "open") {
            stack.unshift(token);
        } else if (token.type === "close") {
            while (stack[0].type !== "open") {
                if (stack.length === 0) {
                    throw {name: "ParsingError", msg: `Mismatched delimiter: ${token.value}`}; // TODO: proper error
                }
                output.push(stack.shift()!);
            }
            stack.shift();
        }
    }
    while (stack.length !== 0) {
        if (stack[0].type === "open") {
            throw {name: "ParsingError", msg: `Mismatched delimiter: ${stack[0].value}`}; // TODO: proper error
        }
        output.push(stack.shift()!);
    }

    // build expression tree
    const createLeafNode: (token: numberToken) => BinaryTreeNode = (token: numberToken) => {
        if (token.type === "variable") {
            return new Variable(token.value);
        } else /* token.type === "number" */ {
            return AbstractNumber.parse(token.value);
        }
    };
    output.reverse();
    if (output.length === 1) {
        expression.root = createLeafNode(output.shift() as numberToken);
    } else {
        const createNode: (token: operatorToken) => BinaryTreeNode = (token: operatorToken) => {
            let left;
            let right;
            if (output[0].type === "operator") {
                right = createNode(output.shift() as operatorToken);
            } else {
                right = createLeafNode(output.shift() as numberToken);
            }
            if (output[0].type === "operator") {
                left = createNode(output.shift() as operatorToken);
            } else {
                left = createLeafNode(output.shift() as numberToken);
            }
            if (token.value === "^") {
                return new Pow(left, right);
            } else if (token.value === "*") {
                return new Mul(left, right);
            } else if (token.value === "/") {
                return new Mul(left, right); // TODO: implement proper behaviour
            } else if (token.value === "+") {
                return new Add(left, right);
            } else /* token.value === "-" */ {
                return new Add(left, right); // TODO: implement proper behaviour
            }
        }
        expression.root = createNode(output.shift() as operatorToken);
    }

    return expression;
}
