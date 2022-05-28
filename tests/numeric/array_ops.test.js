import { suite, test } from "mocha";
import { expect } from "chai";

import {
	array,
	transpose,
	add,
	subtract,
	multiply,
	divide,
	power,
	mod,
	reciprocal,
	round,
	ceil,
	floor
} from "../../build/quasar/index.js";

suite("NDArray arithmetic operations", function() {
	function getElements(array) {
		const elements = [];
		for (const element of array) {
			elements.push(element);
		}
		return elements;
	}

	test("Array transpose works correctly for 2D arrays", function() {
		const arr = array([[1, 2, 3], [4, 5, 6]]);
		const arrT = transpose(arr);
		expect(arr.toString()).to.equal("[[1, 2, 3],\n [4, 5, 6]]");
		expect(arrT.toString()).to.equal("[[1, 4],\n [2, 5],\n [3, 6]]");
	});

	test("add function calculates array sum element-wise", function() {
		const x1 = array([1, 2, 3]);
		const x2 = array([4, 5, 6]);
		const sum = add(x1, x2);
		expect(getElements(sum)).to.deep.equal([5, 7, 9]);
	});

	test("subtract function calculates array difference element-wise", function() {
		const x1 = array([4, 3, 2]);
		const x2 = array([5, 6, 7]);
		const difference = subtract(x1, x2);
		expect(getElements(difference)).to.deep.equal([-1, -3, -5]);
	});

	test("multiply function calculates array product element-wise", function() {
		const x1 = array([4, 5, 6]);
		const x2 = array([7, 8, 9]);
		const product = multiply(x1, x2);
		expect(getElements(product)).to.deep.equal([28, 40, 54]);
	});

	test("divide function calculates array division element-wise", function() {
		const x1 = array([28, 48, 72]);
		const x2 = array([4, 6, 8]);
		const division = divide(x1, x2);
		expect(getElements(division)).to.deep.equal([7, 8, 9]);
	});

	test("power function calculates array exponent element-wise", function() {
		const x1 = array([5, 4, 3]);
		const x2 = array([2, 3, 4]);
		const exponent = power(x1, x2);
		expect(getElements(exponent)).to.deep.equal([25, 64, 81]);
	});

	test("mod function calculates array remainder element-wise", function() {
		const x1 = array([7, 10, 13]);
		const x2 = array([3, 4, 5]);
		const quotient = mod(x1, x2);
		expect(getElements(quotient)).to.deep.equal([1, 2, 3]);
	});

	test("reciprocal function calculates array reciprocal element-wise", function() {
		const x1 = array([2, 3, 4]);
		const inverse = reciprocal(x1);
		expect(getElements(inverse)).to.deep.equal([1/2, 1/3, 1/4]);
	});

	test("round function rounds array element-wise", function() {
		const x1 = array([1.4, 2.5, 3.6]);
		const rounded = round(x1);
		expect(getElements(rounded)).to.deep.equal([1, 3, 4]);
	});

	test("ceil function applies ceiling function to array element-wise", function() {
		const x1 = array([1.4, 2.5, 3.6]);
		const ceiling = ceil(x1);
		expect(getElements(ceiling)).to.deep.equal([2, 3, 4]);
	});

	test("floor function applies floor function to array element-wise", function() {
		const x1 = array([1.4, 2.5, 3.6]);
		const floored = floor(x1);
		expect(getElements(floored)).to.deep.equal([1, 2, 3]);
	});
});
