	this.add = function(a, b){
		const result = new this.Expression(new this.Node("operator", "+"));
		result.root.left = a.root;
		result.root.right = b.root;
		return result
	};

	// this.subtract = function(){
	//
	// };
	//
	// this.multiply = function(){
	//
	// };
	//
	// this.divide = function(){
	//
	// };
	//
	// this.differentiate = function(){
	//
	// };
	//
	// this.integrate = function(){
	//
	// };
