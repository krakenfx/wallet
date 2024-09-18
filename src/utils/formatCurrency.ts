import { Currency, CurrencyInfo, getCurrencyInfo } from '@/screens/Settings/currency/types';

import { getCompactNumberToFormat } from '@/utils/formatTokenAmount';

import { findFirstNonZeroDecimalIndex } from './findFirstNonZeroDecimalIndex';

type Options = {
  currency: Currency;
  hideCurrencySign?: boolean;
  highPrecision?: boolean;
  compact?: boolean;
  findFirstNonZeroDigits?: boolean;
};





export const formatCurrency = (
  currencyValue: string | number = 0,
  { currency, hideCurrencySign = false, highPrecision = false, compact = false, findFirstNonZeroDigits = false }: Options,
) => {
  const currencyValueNumber = Number(currencyValue);
  const numberAbs = Math.abs(currencyValueNumber);
  const isSmallNumber = numberAbs < 1;
  const shouldDisplayCompact = compact && numberAbs >= 1000000; 
  const currencyInfo = getCurrencyInfo(currency);

  
  let maximumFractionDigits = currencyInfo.minimumFractionDigits;
  let minimumFractionDigits = currencyInfo.minimumFractionDigits;
  let prefix = '';
  let postfix = '';
  let numberToFormat = currencyValueNumber;

  if (shouldDisplayCompact) {
    [numberToFormat, postfix] = getCompactNumberToFormat(currencyValueNumber, numberAbs);
  } else if (compact && numberAbs > 1000) {
    minimumFractionDigits = 0;
    maximumFractionDigits = 0;
  }

  if (isSmallNumber) {
    const smallNumberData = getSmallNumberData({ currencyValueNumber, currencyInfo, highPrecision, findFirstNonZeroDigits });

    maximumFractionDigits = smallNumberData.maximumFractionDigits;
    prefix = smallNumberData.prefix;

    if (smallNumberData.tooSmallNumber) {
      numberToFormat = smallNumberData.tooSmallNumber;
    }
  }

  const formatted = Intl.NumberFormat(
    
    'en-US',
    {
      style: hideCurrencySign ? 'decimal' : 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits,
      minimumFractionDigits,
    },
  ).format(numberToFormat);
  const formattedWithOverrides = applyOverrides(formatted, currencyInfo);

  return `${prefix}${formattedWithOverrides}${postfix}`;
};

const HIGH_PRECISION_MAX_DECIMALS_COUNT = 5;
const MAX_DECIMALS_COUNT = 12;



type SmallNumberOptions = { currencyValueNumber: number; currencyInfo: CurrencyInfo; highPrecision?: boolean; findFirstNonZeroDigits?: boolean };

const getSmallNumberData = ({ currencyValueNumber, currencyInfo, highPrecision, findFirstNonZeroDigits }: SmallNumberOptions) => {
  const MAX_FRACTION_DIGITS = findFirstNonZeroDigits ? MAX_DECIMALS_COUNT : HIGH_PRECISION_MAX_DECIMALS_COUNT;
  const tooSmallNumberMaximumFractionDigits = highPrecision || findFirstNonZeroDigits ? MAX_FRACTION_DIGITS : 2;
  const tooSmallNumber: number = highPrecision || findFirstNonZeroDigits ? Math.pow(10, -1 * MAX_FRACTION_DIGITS) : 0.01;
  const isTooSmall = Math.abs(currencyValueNumber) < tooSmallNumber && Math.abs(currencyValueNumber) > 0;
  const isHighPrecisionAndNotTooSmall = (highPrecision || findFirstNonZeroDigits) && !isTooSmall;

  const isNegative = currencyValueNumber < 0;
  const prefix = isTooSmall ? (isNegative ? '-<' : '<') : '';
  const maximumFractionDigits =
    (isHighPrecisionAndNotTooSmall &&
      Math.min(
        MAX_FRACTION_DIGITS,
        
        Math.max(findFirstNonZeroDecimalIndex(currencyValueNumber) + (findFirstNonZeroDigits ? 1 : 0), currencyInfo.minimumFractionDigits),
      )) ||
    (isTooSmall ? tooSmallNumberMaximumFractionDigits : currencyInfo.minimumFractionDigits);

  return { maximumFractionDigits, prefix, tooSmallNumber: isTooSmall ? tooSmallNumber : undefined };
};


const applyOverrides = (currencyValueFormatted: string, currencyInfo: CurrencyInfo) => {
  let result = currencyValueFormatted;

  switch (currencyInfo.symbol) {
    case 'AUD':
      result = result.replace('A$', currencyInfo.sign );
      break;
    case 'CAD':
      result = result.replace('CA$', currencyInfo.sign );
      break;
    case 'CHF':
      result = result.replace('CHF', currencyInfo.sign );
      result = result.replace(',', currencyInfo.groupSeparator );
      break;
    case 'EUR':
      result = result.replace('.', '<@>'); 
      result = result.replaceAll(',', currencyInfo.groupSeparator ); 
      result = result.replace('<@>', currencyInfo.decimalSeparator ); 
      break;
  }

  return result;
};
