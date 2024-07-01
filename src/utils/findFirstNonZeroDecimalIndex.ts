import BigNumber from 'bignumber.js';

const DECIMAL_SIGN_REGEX = /[.]/;
const DECIMALS_REGEX = /[1-9]/;

export const findFirstNonZeroDecimalIndex = (value: string | number) => {
  let _value: string;
  if (typeof value === 'number') {
    _value = BigNumber(value).toString(10);
  } else {
    _value = value;
  }
  const decimalIndex = _value.search(DECIMAL_SIGN_REGEX);
  const decimals = _value.slice(decimalIndex);
  return decimals.search(DECIMALS_REGEX);
};
