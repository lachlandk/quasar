const Quasar = require("../dist/node/quasar");

const a = Quasar.parse("x^3 + 3x^2 + 4x + 9");
const b = Quasar.parse("3x^4 + 6x^2 + 2");

console.log(JSON.stringify(Quasar.add(a, b), null, 4));
