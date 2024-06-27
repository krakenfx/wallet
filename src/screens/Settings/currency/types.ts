import loc from '/loc';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  JPY = 'JPY',
}

export interface CurrencyInfo {
  decimalSeparator: '.' | ',';
  groupSeparator: ',' | '.' | "'";
  minimumFractionDigits: number;
  nameKey: string;
  symbol: string;
  sign: string;
  signPosition: 'prefix' | 'suffix';
}

const currencyInfoMap: Record<Currency, CurrencyInfo> = {
  [Currency.USD]: {
    minimumFractionDigits: 2,
    nameKey: 'usDollar',
    symbol: 'USD',
    sign: '$',
    signPosition: 'prefix',
    decimalSeparator: '.',
    groupSeparator: ',',
  },
  [Currency.GBP]: {
    minimumFractionDigits: 2,
    nameKey: 'britishPound',
    symbol: 'GBP',
    sign: '£',
    signPosition: 'prefix',
    decimalSeparator: '.',
    groupSeparator: ',',
  },
  [Currency.AUD]: {
    minimumFractionDigits: 2,
    nameKey: 'australianDollar',
    symbol: 'AUD',
    sign: '$',
    signPosition: 'prefix',
    decimalSeparator: '.',
    groupSeparator: ',',
  },
  [Currency.EUR]: { minimumFractionDigits: 2, nameKey: 'euro', symbol: 'EUR', sign: '€', signPosition: 'prefix', decimalSeparator: ',', groupSeparator: '.' },
  [Currency.CHF]: {
    minimumFractionDigits: 2,
    nameKey: 'swissFranc',
    symbol: 'CHF',
    sign: 'Fr.',
    signPosition: 'prefix',
    decimalSeparator: '.',
    groupSeparator: "'",
  },
  [Currency.CAD]: {
    minimumFractionDigits: 2,
    nameKey: 'canadianDollar',
    symbol: 'CAD',
    sign: '$',
    signPosition: 'prefix',
    decimalSeparator: '.',
    groupSeparator: ',',
  },
  [Currency.JPY]: {
    minimumFractionDigits: 2,
    nameKey: 'japaneseYen',
    symbol: 'JPY',
    sign: '¥',
    signPosition: 'prefix',
    decimalSeparator: '.',
    groupSeparator: ',',
  },
};

export function getCurrencyInfo(currency: Currency): CurrencyInfo {
  return currencyInfoMap[currency] ?? currencyInfoMap[Currency.USD];
}

export function getLocalizedCurrencyName(currency: Currency): string {
  switch (currency) {
    case Currency.USD:
      return loc.currency.usDollar;
    case Currency.GBP:
      return loc.currency.britishPound;
    case Currency.AUD:
      return loc.currency.australianDollar;
    case Currency.EUR:
      return loc.currency.euro;
    case Currency.CHF:
      return loc.currency.swissFranc;
    case Currency.CAD:
      return loc.currency.canadianDollar;
    case Currency.JPY:
      return loc.currency.japaneseYen;

    default:
      return getCurrencyInfo(currency).nameKey;
  }
}
