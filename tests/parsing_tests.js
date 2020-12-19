const Quasar = require("../dist/node/quasar");

// console.log(Quasar.parse("-56x^2").output()); ERROR
console.log(Quasar.parse("(x+4)(x+3)").output());
console.log(Quasar.parse("x^3+3x^2+4x+9+5").output());

console.log(Quasar.parse("x^(x+1)").output());
console.log(Quasar.parse("3x^(x+1)").output());
// console.log(Quasar.parse("xyz").output()); ERROR
// console.log(Quasar.parse("-x^(x+1)").output()); ERROR
// console.log(Quasar.parse("-(x+1)").output()); ERROR

console.log(Quasar.parse("x^(3x^2+1)").output());
console.log(Quasar.parse("x^(3x^(y+1)+1)").output());

console.log(Quasar.parse("(x+1)^(x+1)").output());
console.log(Quasar.parse("2(x+1)^(2(x+1))").output());
console.log(Quasar.parse("(x+1)^5").output());

// console.log(JSON.stringify(Quasar.parse("x(x+)"), null, 4));

