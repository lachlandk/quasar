import { suite, test } from "mocha";
import { expect } from "chai";

import { UFunc, array } from "../../build/quasar/index.js";

suite("ufunc decorator", function() {

	const arr = array([[1, 2, 3], [4, 5, 6]]);

	test("ufunc executes callback for each element in order for a single array", function() {
		const elements = [];
		const uFunc = UFunc(element => elements.push(element));
		uFunc(arr);
		expect(elements).to.deep.equal([1, 2, 3, 4, 5, 6]);
	});

	test("ufunc executes callback for each element in order with arrays of the same size", function() {
		const sum = [];
		const uFunc = UFunc((a, b) => sum.push(a + b));
		uFunc(arr, arr);
		expect(sum).to.deep.equal([2, 4, 6, 8, 10, 12]);
	});
});