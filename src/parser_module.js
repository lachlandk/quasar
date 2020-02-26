	this.parse = function(input){
		const lexemes = input.match(/\d+|sin|cos|tan|log|ln|root|sqrt|cbrt|{(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|altsigma|varphi)}|\S/ig)
		let tokens = [];
		lexemes.forEach(function(lexeme, i){
			if (lexeme.match(/sin|cos|tan|log|ln|root|sqrt|cbrt/)){
				if (lexeme.match(/sin|cos|tan/) && lexemes[i+1] + lexemes[i+2] + lexemes[i+3] === "^-1"){
					tokens.push({type: "function", value: "arc" + lexeme});
					lexemes.splice(i+3, 1);
					lexemes.splice(i+2, 1);
					lexemes.splice(i+1, 1);
				} else {
					tokens.push({type: "function", value: lexeme})
				}
			} else
			if (lexeme.match(/Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Rho|Tau|Upsilon|Phi|Chi|Psi|Omega/)){
				tokens.push({type: "variable", value: lexeme.slice(1, lexeme.length - 1)})
			} else
			if (lexeme.match(/alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|rho|sigma|tau|upsilon|phi|chi|psi|omega|altsigma|[Vv]arphi|Sigma/)){
				tokens.push({type: "variable", value: lexeme.toLowerCase().slice(1, lexeme.length - 1)})
			} else
			if (lexeme.match(/[Pp]i|[ei]/)){
				tokens.push({type: "constant", value: lexeme.match(/[Pp]i|[ei]/g)[0].toLowerCase()})
			} else
			if (lexeme.match(/\d+/)){
				tokens.push({type: "constant", value: parseInt(lexeme)})
			} else
			if (lexeme.match(/[a-z]/i)){
				tokens.push({type: "variable", value: lexeme})
			} else
			if (lexeme.match(/[+\-*/^]/)){
				if (lexeme.match(/\^/)){
					tokens.push({type: "operator", value: "^", associativity: "right", precedence: 1})
				} else
				if (lexeme.match(/[\/*]/)){
					tokens.push({type: "operator", value: lexeme, associativity: "left", precedence: 2})
				} else
				if (lexeme.match(/[+-]/)){
					tokens.push({type: "operator", value: lexeme, associativity: "left",   precedence: 3})
				}
			} else
			if (lexeme.match(/[(\[]/)){
				tokens.push({type: "open-parenthesis", value: lexeme})
			} else
			if (lexeme.match(/[)\]]/)){
				tokens.push({type: "close-parenthesis", value: lexeme})
			} else
			if (lexeme.match(/,/)){
				tokens.push({type: "delimiter", value: lexeme})
			} else {
				throw {name: "LexingError", msg: "Unknown Token" + lexeme};
			}
		});

		for (let i=0; i<tokens.length; i++){
			if (tokens[i].type === "function" && tokens[i+1].type !== "open-parenthesis" && (tokens[i+1].type === "variable" || tokens[i+1].type === "constant")){
				tokens.splice(i+1, 0, {type: "open-parenthesis", value: "("});
				tokens.splice(i+3, 0, {type: "close-parenthesis", value: ")"});
			}
			if (i !== 0 && (tokens[i].type === "variable" || tokens[i].type === "constant" || tokens[i].type === "open-parenthesis" || tokens[i].type === "function")){
				if (tokens[i-1].type === "variable" || tokens[i-1].type === "constant" || tokens[i-1].type === "close-parenthesis"){
					tokens.splice(i, 0, {type: "operator", value: "*", associativity: "left", precedence: 2})
				}
			} else
			if (tokens[i].type === "operator"){
				if (tokens[i].value.match(/[+-]/) && (i === 0 || tokens[i-1].type === "operator" || tokens[i-1].type === "open-parenthesis" || tokens[i-1].type === "delimiter")){
					if (tokens[i].value === "-"){
						tokens[i] = {type: "operator", value: "~", precedence: 0}
					} else {
						tokens.splice(i, 1)
					}
				}
			}
		}

		let output = [];
		let stack = [];
		while (tokens.length !== 0){
			let token = tokens.shift();
			if (token.type === "constant" || token.type === "variable"){
				output.push(token)
			} else
			if (token.type === "function" || token.type === "open-parenthesis"){
				stack.unshift(token)
			} else
			if (token.type === "delimiter" || token.type === "close-parenthesis"){
				while (stack[0].type !== "open-parenthesis"){
					output.push(stack.shift())
				}
				if (token.type === "close-parenthesis"){
					stack.shift();
					if (stack.length !== 0 && stack[0].type === "function"){
						output.push(stack.shift())
					}
				}
			} else
			if (token.type === "operator"){
				if (token.associativity === "left"){
					while (stack.length !== 0 && stack[0].type === "operator" && stack[0].precedence <= token.precedence){
						output.push(stack.shift())
					}
					stack.unshift(token)
				} else
				if (token.associativity === "right"){
					while (stack.length !== 0 && stack[0].precedence < token.precedence){
						output.push(stack.shift())
					}
					stack.unshift(token)
				} else {
					stack.unshift(token)
				}
			}
		}
		while (stack.length !== 0){
			output.push(stack.shift())
		}
		return output
	};
