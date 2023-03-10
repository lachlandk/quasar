import { suite, test } from "mocha";
import { expect } from "chai";

import { array, arange, linspace } from "../../build/quasar/index.js";

suite("Array creation function", function() {

	test("Nested array is converted to ndarray correctly", function() {
		const arr = array([[1, 2, 3], [4, 5, 6]]);
		expect(arr.shape).to.deep.equal([2, 3]);
		expect(arr[0][0]).to.equal(1);
		expect(arr[0][1]).to.equal(2);
		expect(arr[0][2]).to.equal(3);
		expect(arr[1][0]).to.equal(4);
		expect(arr[1][1]).to.equal(5);
		expect(arr[1][2]).to.equal(6);
	});

	test("Error is thrown if input array is jagged", function() {
		expect(() => array([[1, 2, 3], [4, 5]])).to.throw();
	});
});

suite("arange function", function() {

	test("1D array of integers from 0 to stop (not inclusive) is created when only stop argument is passed", function() {
		const range = arange(10);
		expect(range.shape).to.deep.equal([10]);
		expect(range[0]).to.equal(0);
		expect(range[-1]).to.equal(9);
	});

	test("1D array from start to stop with interval 1 is created when start and stop arguments are passed", function() {
		const range = arange(-5.5, 5.5);
		expect(range.shape).to.deep.equal([11]);
		expect(range[0]).to.equal(-5.5);
		expect(range[-1]).to.equal(4.5);
	});

	test("Step argument works correctly", function() {
		const range = arange(0, 5, 0.5);
		expect(range.shape).to.deep.equal([10]);
		expect(range[0]).to.equal(0);
		expect(range[-1]).to.equal(4.5);
		expect(() => arange(-10, 10, -1)).to.throw();
	});

	test("Error is thrown if start argument is greater than stop argument", function() {
		expect(() => arange(10, -10)).to.throw();
		throw ``;  // TODO: not correct error
	});
});

suite("linspace function", function() {

	test("1D array of length 50 from start to stop (inclusive) is created when no num argument provided", function() {
		const space = linspace(0, 10);
		expect(space.shape).to.deep.equal([50]);
		expect(space[0]).to.equal(0);
		expect(space[-1]).to.equal(10);
	});

	test("1D array of length num from start to stop is created when all arguments present", function() {
		const space = linspace(-5.5, 5.5, 10);
		expect(space.size).to.equal(10);
		expect(space[0]).to.equal(-5.5);
		expect(space[-1]).to.equal(5.5);
		expect(() => linspace(0, 10, -1)).to.throw();
	});

	test("Error is thrown if start argument is greater than stop argument", function() {
		expect(() => linspace(10, -10)).to.throw();
	});
});
