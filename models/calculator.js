const sum = (number1, number2) => {
  if (typeof number1 !== "number" || typeof number2 !== "number") {
    throw new Error("The Parameters should be a type of Number");
  }
  return number1 + number2;
};

exports.sum = sum;
