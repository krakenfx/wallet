import BigNumber from 'bignumber.js';

import { getAvailableTokenBalance } from '@/realm/tokens/getAvailableTokenBalance';
import { RealmPendingTransaction } from '@/realm/transactions';
import { Currency, getCurrencyInfo } from '@/screens/Settings/currency/types';
import { unitConverter } from '@/utils/unitConverter';

export function amountInTokenUnitShortened(amountInSmallestUnits: BigNumber.Value, decimals: number): string {
  const amountInTokenUnit = unitConverter.smallUnit2TokenUnit(amountInSmallestUnits, decimals).toString(10);
  const amountInTokenUnitShortened = amountStringShortened(amountInTokenUnit);

  return amountInTokenUnitShortened;
}

export function amountStringShortened(amountString: string, decimals = 6): string {
  const [celoye, drobnoye] = amountString.split('.');
  if (!drobnoye || decimals <= 0) {
    return celoye;
  }

  return `${celoye}.${drobnoye.substring(0, decimals)}`;
}

export function tokenAmountShortened(token: {
  balance: string;
  metadata: { decimals: number };
  pendingTransactions?: Realm.List<RealmPendingTransaction>;
}): string {
  return amountStringShortened(tokenAmountFull({ balance: getAvailableTokenBalance(token), metadata: token.metadata }));
}

export function tokenAmountShortenedDisplay(token: {
  balance: string;
  metadata: { decimals: number };
  pendingTransactions?: Realm.List<RealmPendingTransaction>;
}): string {
  const realBalance = getAvailableTokenBalance(token);
  const tokenAmount = unitConverter.smallUnit2TokenUnit(realBalance, token.metadata.decimals);
  const tokenAmountString = tokenAmount.toString(10);

  if (tokenAmount.isLessThan(1)) {
    return amountStringShortened(tokenAmountString, 5);
  }

  if (tokenAmount.isGreaterThanOrEqualTo(1) && tokenAmount.isLessThan(1000000)) {
    return amountStringShortened(tokenAmountString, 2);
  }

  if (tokenAmount.isGreaterThanOrEqualTo(1000000) && tokenAmount.isLessThan(1000000000)) {
    return amountStringShortened(tokenAmount.dividedBy(1000000).toString(10), 2) + 'M';
  }

  if (tokenAmount.isGreaterThanOrEqualTo(1000000000)) {
    return amountStringShortened(tokenAmount.dividedBy(1000000000).toString(10), 2) + 'B';
  }

  return '-';
}

export function tokenAmountFull(token: { balance: BigNumber.Value; metadata: { decimals: number } }): string {
  return unitConverter.smallUnit2TokenUnit(token.balance, token.metadata.decimals).toString(10);
}

export function checkForNaN(bigNumber: BigNumber, fallback: string): string {
  return isNaN(bigNumber.toNumber()) ? fallback : bigNumber.toString(10);
}

export const formatter = {
  tokenAmountShortened,
  tokenAmountShortenedDisplay,
  tokenAmountFull,
};

export function prettifyFiatValue(fiatValue: number): string {
  const numArr = [];
  let ret = '';
  let sign = fiatValue < 0 ? '-' : '';
  let fiatValueCopy = Math.abs(fiatValue);

  let fractional = new BigNumber(fiatValueCopy).minus(Math.floor(fiatValueCopy)).toFixed(2);
  fractional = String(fractional).replace('0.', '.');

  if (fractional.includes('1.00')) {
    fractional = fractional.replace('1.00', '.00');
    fiatValueCopy = fiatValueCopy + 1;
  }

  const numberz = String(Math.floor(fiatValueCopy)).split('').reverse();
  for (let c = 0; c < numberz.length; c++) {
    numArr.push(numberz[c]);
    if ((c + 1) % 3 === 0) {
      numArr.push(',');
    }
  }

  ret = numArr.reverse().join('');
  if (ret.startsWith(',')) {
    ret = ret.substring(1);
  }

  return sign + ret + fractional;
}

export function removeProtocol(url: string): string {
  return url.replace(/(^[\w-]+:|^)\/\//, '');
}

export function removeWWWSubdomain(url: string): string {
  return url.replace(/(?<=\/|^)www\./i, '');
}

export function findFirstNonZeroDecimalIndex(number: string): number {
  const decimal = /[.]/;
  const decimalIndex = number.search(decimal);
  const decimals = number.slice(decimalIndex);
  const firstNonZeroDecimalIndex = decimals.search(/[1-9]/);

  return firstNonZeroDecimalIndex;
}

export function formatAppCurrencyValue(number: string | number = 0, currency: Currency, prettify: boolean = false, allowNegativeValue = true): string {
  let number_ = Number(number);
  const isNegative = number_ < 0;
  if (!allowNegativeValue && isNegative) {
    number_ = 0;
  }
  const firstNonZeroDecimalIndex = findFirstNonZeroDecimalIndex(String(number_));
  const isSmallNumber = Math.abs(number_) < 1;
  const needsMoreFractionDigits = firstNonZeroDecimalIndex > 2;
  const fractionDigits = isSmallNumber && needsMoreFractionDigits ? firstNonZeroDecimalIndex + 1 : 2;

  const currencyInfo = getCurrencyInfo(currency);

  const minusLabel = allowNegativeValue && isNegative ? '-' : '';
  const valueLabel = prettify ? prettifyFiatValue(Math.abs(number_)) : Math.abs(number_).toFixed(fractionDigits);
  const prefixSignLabel = currencyInfo.signPosition === 'prefix' ? currencyInfo.sign : '';
  const suffixSignLabel = currencyInfo.signPosition === 'suffix' ? currencyInfo.sign : '';

  return `${minusLabel}${prefixSignLabel}${valueLabel}${suffixSignLabel}`;
}

export const untilFirstBackslash = /^[^/]*/;
export const untilFirstColon = /^[^:]*/;
