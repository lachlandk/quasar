(function (root, factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.Quasar = factory();
	}
}(typeof self !== "undefined" ? self : this, function () {
	return {
		parse: function (input){
			let output = input;
			return output;
		},

		output: function (input) {
			let output = "\\[" + input + "\\]";
			return output;
		},

		gcd: function (num1, num2) {
			let a = Math.max(Math.abs(num1), Math.abs(num2)),
				b = Math.min(Math.abs(num1), Math.abs(num2));
			while (b !== 0){
				let r = a % b;
				a = b;
				b = r;
			}
			return a;
		},

		bezout: function(num1, num2) {
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
		},

		lcm: function (num1, num2) {
			return Math.abs(num1 * num2) / this.gcd(num1, num2);
		}
	}
}));
