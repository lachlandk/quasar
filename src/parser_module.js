	this.Node = function(type, value, properties){
		this.type = type;
		this.value = value;
		this.properties = {};
		for (const property in properties){
			this.properties[property] = properties[property];
		}
		this.left = null;
		this.right = null;
	};

	this.Expression = function(root=null){
		this.root = root;

		// this.expand = function(){
		// };
	};

	this.parse = function(input){
		const lexemes = input.match(/\d+|\S/ig);
		const tokens = [];
		if (!lexemes){
			return new this.Expression();
		}
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
			if (lexeme.match(/\(/)){
				tokens.push({type: "open-parenthesis", value: "("});
			} else
			if (lexeme.match(/\)/)){
				tokens.push({type: "close-parenthesis", value: ")"});
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
				if (tokens[i].value === "-" && tokens[i+1] && tokens[i+1].value === "-"){
					tokens[i] = {type: "operator", value: "+", associativity: "left", precedence: 3};
					tokens.splice(i+1, 1);
				}
				if (tokens[i].value.match(/[+-]/) && (i === 0 || tokens[i-1].type === "operator" || tokens[i-1].type === "open-parenthesis")) {
					if (tokens[i].value === "-") {
						tokens[i] = {type: "operator", value: "~", precedence: 0};
					} else if (tokens[i].value === "+") {
						tokens.splice(i, 1);
					}
				}
				if (tokens[i] && tokens[i].value.match(/[/*-+^]/) && ((tokens[i-1] && tokens[i-1].type === "operator") || !tokens[i-1] || !tokens[i+1])){
					throw {name: "ParsingError", msg: "Invalid operands for operator: " + tokens[i].value};
					// TODO: not working "x(x+)"
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
					if (stack.length === 0){
						throw {name: "ParsingError", msg: "Mismatched delimiter: )"};
					}
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
			if (stack[0].type === "open-parenthesis"){
				throw {name: "ParsingError", msg: "Mismatched delimiter: )"};
			}
			output.push(stack.shift());
		}

		// convert to binary tree
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

		// semantic analysis
		const expression = new this.Expression(stack[0]);
		function analyse(node, Quasar){
			if (!node || node.type !== "operator"){
				return;
			}
			analyse(node.left, Quasar);
			analyse(node.right, Quasar);
			if (node.value.match(/[\^/*~]/)){
				if (node.value !== "~" && node.right.type === "operator"){
					node.right.type = "expression";
					node.right.value = new Quasar.Expression(new Quasar.Node("operator", node.right.value));
					node.right.value.root.left = node.right.left;
					node.right.value.root.right = node.right.right;
					node.right.left = null;
					node.right.right = null;
				}
				if (node.left.type === "operator"){
					node.left.type = "expression";
					node.left.value = new Quasar.Expression(new Quasar.Node("operator", node.left.value));
					node.left.value.root.left = node.left.left;
					node.left.value.root.right = node.left.right;
					node.left.left = null;
					node.left.right = null;
				}
			}
			if (node.value === "^" && node.left.type === "variable" && (node.right.type === "constant" || node.right.type === "variable" || node.right.type === "expression")){
				node.type = "variable";
				node.value = node.left.value;
				node.properties.coefficient = new Quasar.Node("constant", 1);
				node.properties.power = node.right;
				node.left = null;
				node.right = null;
			}
			if (node.value === "*" && node.left.type === "constant" && (node.right.type === "constant" || node.right.type === "variable" || node.right.type === "expression")){
				node.type = "variable";
				node.value = node.right.value;
				node.properties.coefficient = node.left;
				node.right.properties.power ? node.properties.power = node.right.properties.power : null;
				node.left = null;
				node.right = null;
			}
			// if (node.type === "expression" && !node.properties.analysed){
			// 	analyse(node.value.root.left, Quasar);
			// 	analyse(node.value.root.right, Quasar);
			// }
		}
		analyse(expression.root, this);


		return expression;
	};
