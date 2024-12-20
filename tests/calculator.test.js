const calculator = require("../models/calculator");

test("sum 2 + 2 should returns 4", () => {
  const result = calculator.sum(2, 2);

  expect(result).toBe(4);
});

test("sum 100 + 5 should returns 105", () => {
  const result = calculator.sum(100, 5);

  expect(result).toBe(105);
});

test("sum 'banana' + 5 should returns an Error", () => {
  const sumFunction = () => calculator.sum("banana", 5);

  expect(sumFunction).toThrow(Error);
});

test("sum 5 + 'banana' should returns an Error", () => {
  const sumFunction = () => calculator.sum(5, "banana");

  expect(sumFunction).toThrow(Error);
});
