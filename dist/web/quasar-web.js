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

}));