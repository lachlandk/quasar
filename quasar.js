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
		}
	}
}));
