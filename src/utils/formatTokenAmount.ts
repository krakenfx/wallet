import type { Currency, CurrencyInfo } from '@/screens/Settings/currency/types';
import { getCurrencyInfo } from '@/screens/Settings/currency/types';

export type FormatTokenAmountOptions = {
  compact?: boolean;

  currency: Currency;
  grouping?: Intl.NumberFormatOptions['useGrouping'];
} & (
  | {
      highPrecision: true;
      isBtc?: boolean;
    }
  | {
      highPrecision?: false;
      isBtc?: never;
    }
);

export const formatTokenAmount = (
  tokenAmount: string,
  { compact = false, currency, grouping, highPrecision = false, isBtc = false }: FormatTokenAmountOptions,
) => {
  const tokenAmountNumber = Number(tokenAmount);

  if (tokenAmountNumber === 0 || Number.isNaN(tokenAmountNumber)) {
    return '0';
  }

  const tokenAmountNumberAbs = Math.abs(tokenAmountNumber);
  const isNegative = tokenAmountNumber < 0;
  const shouldDisplayCompact = compact && tokenAmountNumberAbs >= 1000000;
  const currencyInfo = getCurrencyInfo(currency);

  let numberToFormat = tokenAmountNumber;
  let maximumFractionDigits: number | undefined;
  let minimumFractionDigits = 0;
  let prefix = '';
  let postfix = '';

  if (!highPrecision) {
    if (tokenAmountNumberAbs < 0.0001) {
      numberToFormat = 0.0001;
      minimumFractionDigits = 4;
      prefix = isNegative ? '-<' : '<';
    } else if (tokenAmountNumberAbs < 10) {
      maximumFractionDigits = 4;
    } else {
      if (shouldDisplayCompact) {
        [numberToFormat, postfix] = getCompactNumberToFormat(tokenAmountNumber, tokenAmountNumberAbs);
        maximumFractionDigits = 1;
      } else {
        maximumFractionDigits = 2;
      }
    }
  }

  if (highPrecision) {
    if (isBtc) {
      if (tokenAmountNumberAbs < 1) {
        maximumFractionDigits = 8;
      } else if (tokenAmountNumberAbs < 10) {
        maximumFractionDigits = 6;
      } else {
        if (shouldDisplayCompact) {
          [numberToFormat, postfix] = getCompactNumberToFormat(tokenAmountNumber, tokenAmountNumberAbs);
          maximumFractionDigits = 3;
        } else {
          maximumFractionDigits = 4;
        }
      }
    } else {
      if (tokenAmountNumberAbs < 0.00000001) {
        numberToFormat = 0.00000001;
        minimumFractionDigits = 8;
        prefix = isNegative ? '-<' : '<';
      } else if (tokenAmountNumberAbs < 0.000001) {
        maximumFractionDigits = 8;
      } else if (tokenAmountNumberAbs < 10) {
        maximumFractionDigits = 6;
      } else {
        if (shouldDisplayCompact) {
          [numberToFormat, postfix] = getCompactNumberToFormat(tokenAmountNumber, tokenAmountNumberAbs);
          maximumFractionDigits = 3;
        } else {
          maximumFractionDigits = 4;
        }
      }
    }
  }

  const formatted = Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency,
    useGrouping: grouping,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numberToFormat);

  const formattedWithOverrides = applyOverrides(formatted, currencyInfo);

  return `${prefix}${formattedWithOverrides}${postfix}`;
};

const applyOverrides = (tokenAmountFormatted: string, currencyInfo: CurrencyInfo) => {
  let result = tokenAmountFormatted;

  switch (currencyInfo.symbol) {
    case 'CHF':
      result = result.replace(',', currencyInfo.groupSeparator);
      break;
    case 'EUR':
      result = result.replace('.', '<@>');
      result = result.replaceAll(',', currencyInfo.groupSeparator);
      result = result.replace('<@>', currencyInfo.decimalSeparator);
      break;
  }

  return result;
};

export const getCompactNumberToFormat = (tokenAmountNumber: number, tokenAmountNumberAbs: number): [number, string] => {
  let compactNumberToFormat = tokenAmountNumber;
  let postfix = '';

  if (tokenAmountNumberAbs >= 1e6 && tokenAmountNumberAbs < 1e9) {
    compactNumberToFormat = tokenAmountNumber / 1e6;
    postfix = 'M';
  } else if (tokenAmountNumberAbs >= 1e9 && tokenAmountNumberAbs < 1e12) {
    compactNumberToFormat = tokenAmountNumber / 1e9;
    postfix = 'B';
  } else if (tokenAmountNumberAbs >= 1e12 && tokenAmountNumberAbs < 1e15) {
    compactNumberToFormat = tokenAmountNumber / 1e12;
    postfix = 'T';
  }

  return [compactNumberToFormat, postfix];
};
