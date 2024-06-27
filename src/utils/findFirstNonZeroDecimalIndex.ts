export const findFirstNonZeroDecimalIndex = (number: string) => {
  const decimal = /[.]/;
  const decimalIndex = number.search(decimal);
  const decimals = number.slice(decimalIndex);
  const firstNonZeroDecimalIndex = decimals.search(/[1-9]/);

  return firstNonZeroDecimalIndex;
};
