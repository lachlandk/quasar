	this.Node = function(type, value){
		this.type = type;
		this.value = value;
		this.left = null;
		this.right = null;
	};

	this.Expression = function(root=null){
		this.root = root;
	};

	this.parse = function(input){
		const lexemes = input.match(/\d+|\S/ig);
		const tokens = [];
		lexemes.forEach(function(lexeme, i){
			if (lexeme.match(/\d+/)){
				tokens.push({type: "constant", value: parseInt(lexeme)});
			} else
			if (lexeme.match(/[a-z]/i)){
				tokens.push({type: "variable", value: lexeme});
			} else
			if (lexeme.match(/[+\-*/^]/)){
				if (lexeme.match(/\^/)){
					tokens.push({type: "operator", value: "^", associativity: "right", precedence: 1});
				} else
				if (lexeme.match(/[\/*]/)){
					tokens.push({type: "operator", value: lexeme, associativity: "left", precedence: 2});
				} else
				if (lexeme.match(/[+-]/)){
					tokens.push({type: "operator", value: lexeme, associativity: "left",   precedence: 3});
				}
			} else
			if (lexeme.match(/[(\[]/)){
				tokens.push({type: "open-parenthesis", value: lexeme});
			} else
			if (lexeme.match(/[)\]]/)){
				tokens.push({type: "close-parenthesis", value: lexeme});
			} else
			if (lexeme.match(/,/)){
				tokens.push({type: "delimiter", value: lexeme});
			} else {
				throw {name: "LexingError", msg: "Unknown Token: " + lexeme};
			}
		});

		// special cases
		for (let i=0; i<tokens.length; i++){
			if (i !== 0 && (tokens[i].type === "variable" || tokens[i].type === "constant" || tokens[i].type === "open-parenthesis")){
				if (tokens[i-1].type === "variable" || tokens[i-1].type === "constant" || tokens[i-1].type === "close-parenthesis"){
					tokens.splice(i, 0, {type: "operator", value: "*", associativity: "left", precedence: 2})
				}
			} else
			if (tokens[i].type === "operator"){
				if (tokens[i].value.match(/[+-]/) && (i === 0 || tokens[i-1].type === "operator" || tokens[i-1].type === "open-parenthesis")){
					if (tokens[i].value === "-"){
						tokens[i] = {type: "operator", value: "~", precedence: 0};
					} else {
						tokens.splice(i, 1);
					}
				}
			}
		}

		const output = [];
		const stack = [];
		while (tokens.length !== 0){
			const token = tokens.shift();
			if (token.type === "constant" || token.type === "variable"){
				output.push(token);
			} else
			if (token.type === "open-parenthesis"){
				stack.unshift(token);
			} else
			if (token.type === "close-parenthesis"){
				while (stack[0].type !== "open-parenthesis"){
					output.push(stack.shift());
				}
				stack.shift();
			} else
			if (token.type === "operator"){
				if (token.associativity === "left"){
					while (stack.length !== 0 && stack[0].type === "operator" && stack[0].precedence <= token.precedence){
						output.push(stack.shift());
					}
					stack.unshift(token);
				} else
				if (token.associativity === "right"){
					while (stack.length !== 0 && stack[0].precedence < token.precedence){
						output.push(stack.shift());
					}
					stack.unshift(token);
				} else {
					stack.unshift(token);
				}
			}
		}
		while (stack.length !== 0){
			output.push(stack.shift());
		}

		output.forEach(function(token, i){
			if (token.type === "variable" || token.type === "constant"){
				stack.unshift(new this.Node(token.type, token.value));
			} else
			if (token.type === "operator"){
				if (token.precedence === 0){
					let node = new this.Node(token.type, token.value);
					node.left = stack.shift();
					stack.unshift(node);
				} else {
					let node = new this.Node(token.type, token.value);
					node.right = stack.shift();
					stack.length > 0 ? node.left = stack.shift() : null;
					stack.unshift(node);
				}
			}
		}, this);

		return new this.Expression(stack[0])
	};
