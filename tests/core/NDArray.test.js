import { suite, test } from "mocha";
import { expect } from "chai";

import { NDArray } from "../../build/quasar/index.js";

suite("NDArray constructor", function() {

	const array = new NDArray([2, 3]);

	test("Array shape is set correctly", function() {
		expect(array.shape).to.deep.equal([2, 3]);
	});

	test("Array dimension is set correctly", function() {
		expect(array.dimension).to.equal(2);
	});

	test("Error is thrown if array shape argument is not an array of integers", function() {
		expect(() => {return new NDArray([2.5]);}).to.throw();
	});

	test("Array size is set correctly", function() {
		expect(array.size).to.equal(2 * 3);
	});

	test("Length of ArrayBuffer is set correctly", function() {
		expect(array.byteLength).to.equal(2 * 3 * array.itemSize);
	});

	test("Strides are set correctly if no argument is given", function() {
		const array = new NDArray([2, 3, 4]);
		expect(array.strides).to.deep.equal([4 * 3 * array.itemSize, 4 * array.itemSize, array.itemSize]);
	});

	test("Error is thrown if offset argument is not an integer multiple of itemSize", function() {
		const buffer = new ArrayBuffer(6 * 8);
		expect(() => {return new NDArray([2, 3], "float64", buffer, 9);}).to.throw();
	});
});

suite("NDArray.get() method", function() {

	const array = new NDArray([2, 3]);
	array.data.setFloat64(0, 1);
	array.data.setFloat64(8, 2);
	array.data.setFloat64(16, 3);
	array.data.setFloat64(24, 4);
	array.data.setFloat64(32, 5);
	array.data.setFloat64(40, 6);

	test("Correct entry is returned when number of indices is equal to dimension", function() {
		expect(array.get(0, 1)).to.equal(2);
		expect(array.get(1, 2)).to.equal(6);
	});

	test("Correct subarray is returned when number of indices passed is less than dimension", function() {
		const subarray = array.get(1);
		expect(subarray.shape).to.deep.equal([3]);
		expect(subarray.get(0)).to.equal(4);
		expect(subarray.get(1)).to.equal(5);
		expect(subarray.get(2)).to.equal(6);
	});

	test("Error is thrown when array index is out of range", function() {
		expect(() => array.get(0, 3)).to.throw();
		expect(() => array.get(1, 3)).to.throw();
	});

	test("Error is thrown when too many indices passed", function() {
		expect(() => array.get(0, 0, 0)).to.throw();
	});
});

suite("NDArray.set() method", function() {

	const array = new NDArray([2, 3]);

	test("Correct entry is set when correct number of indices are passed", function() {
		array.set(10, 1, 2);
		expect(array.data.getFloat64(40)).to.equal(10);
	});

	test("Error is thrown when array index is out of range", function() {
		expect(() => array.set(10, 0, 3)).to.throw();
		expect(() => array.set(10, 1, 3)).to.throw();
	});

	test("Error is thrown when number of indices is not equal to dimension", function() {
		expect(() => array.set(10, 0)).to.throw();
		expect(() => array.set(10, 0, 0, 0)).to.throw();
	});
});

suite("NDArray.slice() method", function() {

	const array = new NDArray([4, 6]);

	test("Correct 1D subarray is returned when number of indices is equal to dimension", function() {
		const subarray = array.slice([1, 3, 1], [1, 4, 1]);
		expect(subarray.shape).to.deep.equal([2, 3]);
		expect(subarray.data.byteOffset).to.equal(6 * subarray.itemSize + subarray.itemSize);
	});

	test("Correct subarray is returned when number of indices is less than dimension", function() {
		const subarray = array.slice([2, 4, 1]);
		expect(subarray.shape).to.deep.equal([2, 6]);
		expect(subarray.data.byteOffset).to.equal(2 * 6 * subarray.itemSize);
	});

	test("Correct strides are set when step is not equal to 1", function() {
		const subarray = array.slice([0, 4, 2], [0, 6, 2]);
		expect(subarray.shape).to.deep.equal([2, 3]);
		expect(subarray.strides).to.deep.equal([3 * 2 * 2 * subarray.itemSize, 2 * array.itemSize]);
	});

	test("Unnecessary dimensions are removed if their length is 1", function() {
		const subarray = array.slice([0, 1, 2], [0, 6, 1]);
		expect(subarray.shape).to.deep.equal([6]);
	});


	test("Error is thrown if slices contain non-integer values", function() {
		expect(() => array.slice([0, 1.5, 1], [0, 6, 2.5])).to.throw();
	});

	test("Error is thrown if stop index is lower than or equal to start index", function() {
		expect(() => array.slice([2, 1, 1])).to.throw();
	});

	test("Error is thrown if step is zero", function() {
		expect(() => array.slice([0, 4, 0])).to.throw();
	});

	test("Error is thrown when too many slices passed", function() {
		expect(() => array.slice([0, 4, 1], [0, 6, 1], [0, 5, 1])).to.throw();
	});
});

suite("NDArray.toString() method", function() {

	test("1D array is formatted correctly", function() {
		const array = new NDArray([4]);
		expect(array.toString()).to.equal("[0, 0, 0, 0]");
	});

	test("ND array is formatted correctly", function() {
		const array = new NDArray([2, 3]);
		expect(array.toString()).to.equal("[[0, 0, 0],\n [0, 0, 0]]");
	});
});

suite("NDArray iteration", function() {

	const array = new NDArray([2, 2]);
	array.data.setFloat64(0, 1);
	array.data.setFloat64(8, 2);
	array.data.setFloat64(16, 3);
	array.data.setFloat64(24, 4);

	test("Using forEach() method, callback is run for each element in the correct order", function() {
		const elements = [];
		const indices = [];
		array.forEach((element, index) => {
			elements.push(element);
			indices.push(index);
		});
		expect(elements).to.deep.equal([1, 2, 3, 4]);
		expect(indices).to.deep.equal([[0, 0], [0, 1], [1, 0], [1, 1]]);
	});

	test("Using a for loop, elements are iterated through in the correct order", function() {
		const elements = [];
		for (const element of array) {
			elements.push(element);
		}
		expect(elements).to.deep.equal([1, 2, 3, 4]);
	});
});

suite("NDArray indexing", function() {

	const array = new NDArray([4, 6]);
	array.data.setFloat64(2 * 6 * array.itemSize + 2 * array.itemSize, 10);

	test("When indexing with a comma-separated list of integers, the correct element or subarray is returned", function() {
		expect(array["2, 2"]).to.equal(10);
	});

	test("When indexing with a comma-separated list of slices, the correct view is returned", function() {
		const subarray = array["2:, 2:4"];
		expect(subarray.shape).to.deep.equal([2, 2]);
		expect(subarray.data.byteOffset).to.equal(2 * 6 * subarray.itemSize + 2 * subarray.itemSize);
	});

	test("When setting an element with a comma-separated list of integers, the correct element is updated", function() {
		array["2, 2"] = 100;
		expect(array.data.getFloat64(2 * 6 * array.itemSize + 2 * array.itemSize)).to.equal(100);
	});
});
