(function (root, constructor){
	root.Quasar = new constructor();
}(self, function (){
	this.gcd = function(num1, num2){
		let a = Math.max(Math.abs(num1), Math.abs(num2)),
			b = Math.min(Math.abs(num1), Math.abs(num2));
		while (b !== 0){
			let r = a % b;
			a = b;
			b = r;
		}
		return a;
	};

	this.bezout = function(num1, num2){
		let a = Math.max(Math.abs(num1), Math.abs(num2)),
			b = Math.min(Math.abs(num1), Math.abs(num2));
		let a1 = 1,
			b1 = 0,
			a2 = 0,
			b2 = 1;
		while (b !== 0){
			let q = Math.floor(a / b),
				r = a - q*b,
				r1 = a1 - q*b1,
				r2 = a2 - q*b2;
			a = b;
			a1 = b1;
			a2 = b2;
			b = r;
			b1 = r1;
			b2 = r2;
		}
		return [a2, a1]
	};

	this.lcm = function(num1, num2) {
		return Math.abs(num1 * num2) / this.gcd(num1, num2);
	};

	this.Node = function(type, value, properties) {
		this.type = type;
		this.value = value;
		this.properties = {};
		for (const property in properties) {
			if (properties.hasOwnProperty(property)) {
				this.properties[property] = properties[property];
			}
		}
	};

	this.Expression = function(){
		this.tree = [];

		this.append = function(node){
			this.tree.unshift(node);
		}
	};

	this.parse = function(input){
		const lexemes = input.match(/\d+|\S/ig);
		let tokens = [];
		lexemes.forEach(function(lexeme, i){
			if (lexeme.match(/\d+/)){
				tokens.push(new this.Node("constant", parseInt(lexeme)));
			} else
			if (lexeme.match(/[a-z]/i)){
				tokens.push(new this.Node("variable", lexeme));
			} else
			if (lexeme.match(/[+\-*/^]/)){
				if (lexeme.match(/\^/)){
					tokens.push(new this.Node("operator", "^", {associativity: "right", precedence: 1}));
				} else
				if (lexeme.match(/[\/*]/)){
					tokens.push(new this.Node("operator", lexeme, {associativity: "left", precedence: 2}));
				} else
				if (lexeme.match(/[+-]/)){
					tokens.push(new this.Node("operator", lexeme, {associativity: "left", precedence: 3}));
				}
			} else
			if (lexeme.match(/\(/)){
				tokens.push(new this.Node("open-parenthesis", "("));
			} else
			if (lexeme.match(/\)/)){
				tokens.push(new this.Node("close-parenthesis", ")"));
			} else {
				throw {name: "LexingError", msg: "Unknown Token" + lexeme};
			}
		}, this);

		for (let i=0; i<tokens.length; i++){
			if (tokens[i].type === "function" && tokens[i+1].type !== "open-parenthesis" && (tokens[i+1].type === "variable" || tokens[i+1].type === "constant")){
				tokens.splice(i+1, 0, new this.Node("open-parenthesis", "("));
				tokens.splice(i+3, 0, new this.Node("close-parenthesis", ")"));
			}
			if (i !== 0 && (tokens[i].type === "variable" || tokens[i].type === "constant" || tokens[i].type === "open-parenthesis" || tokens[i].type === "function")){
				if (tokens[i-1].type === "variable" || tokens[i-1].type === "constant" || tokens[i-1].type === "close-parenthesis"){
					tokens.splice(i, 0, new this.Node("operator", "*", {associativity: "left", precedence: 2}));
				}
			} else
			if (tokens[i].type === "operator"){
				if (tokens[i].value.match(/[+-]/) && (i === 0 || tokens[i-1].type === "operator" || tokens[i-1].type === "open-parenthesis" || tokens[i-1].type === "delimiter")){
					if (tokens[i].value === "-"){
						tokens[i] = new this.Node("operator", "~", {precedence: 0});
					} else {
						tokens.splice(i, 1);
					}
				}
			}
		}

		let output = new this.Expression();
		let stack = [];
		while (tokens.length !== 0){
			let token = tokens.shift();
			if (token.type === "constant" || token.type === "variable"){
				output.append(token)
			} else
			if (token.type === "function" || token.type === "open-parenthesis"){
				stack.unshift(token)
			} else
			if (token.type === "delimiter" || token.type === "close-parenthesis"){
				while (stack[0].type !== "open-parenthesis"){
					output.append(stack.shift())
				}
				if (token.type === "close-parenthesis"){
					stack.shift();
					if (stack.length !== 0 && stack[0].type === "function"){
						output.append(stack.shift())
					}
				}
			} else
			if (token.type === "operator"){
				if (token.properties.associativity === "left"){
					while (stack.length !== 0 && stack[0].type === "operator" && stack[0].properties.precedence <= token.properties.precedence){
						output.append(stack.shift())
					}
					stack.unshift(token)
				} else
				if (token.properties.associativity === "right"){
					while (stack.length !== 0 && stack[0].properties.precedence < token.properties.precedence){
						output.append(stack.shift())
					}
					stack.unshift(token)
				} else {
					stack.unshift(token)
				}
			}
		}
		while (stack.length !== 0){
			output.append(stack.shift())
		}
		return output
	};

}));