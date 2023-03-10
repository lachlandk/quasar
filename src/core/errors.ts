export class ValueError extends Error {
    name = "ValueError"

    constructor(message: string, value: unknown) {
        super(`${message}: ${value}`);
    }
}

export class ParseError extends ValueError {
    name = "ParseError"

    constructor(message: string, input: string) {
        super(message, input);
    }
}

export class IndexError extends Error {
    name = "IndexError"

    constructor(index: number, axis: number, size: number) {
        super(`Index ${index} is out of bounds for axis ${axis} with size ${size}`);
    }
}
