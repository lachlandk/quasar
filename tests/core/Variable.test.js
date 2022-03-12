import { suite, test } from "mocha";
import { expect } from "chai";

import { Variable } from "../../build/quasar/index.js";

suite("Variable type", function() {

	const x = new Variable("x");

	test("toString() works correctly", function () {
		expect(x.toString()).to.equal("x");
	});
});
