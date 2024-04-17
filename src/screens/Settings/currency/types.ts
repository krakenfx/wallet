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
  nameKey: string;
  symbol: string;
  sign: string;
  signPosition: 'prefix' | 'suffix';
}

const currencyInfoMap: Record<Currency, CurrencyInfo> = {
  [Currency.USD]: { nameKey: 'usDollar', symbol: 'USD', sign: '$', signPosition: 'prefix' },
  [Currency.GBP]: { nameKey: 'britishPound', symbol: 'GBP', sign: '£', signPosition: 'prefix' },
  [Currency.AUD]: { nameKey: 'australianDollar', symbol: 'AUD', sign: '$', signPosition: 'prefix' },
  [Currency.EUR]: { nameKey: 'euro', symbol: 'EUR', sign: '€', signPosition: 'prefix' },
  [Currency.CHF]: { nameKey: 'swissFranc', symbol: 'CHF', sign: 'Fr.', signPosition: 'prefix' },
  [Currency.CAD]: { nameKey: 'canadianDollar', symbol: 'CAD', sign: '$', signPosition: 'prefix' },
  [Currency.JPY]: { nameKey: 'japaneseYen', symbol: 'JPY', sign: '¥', signPosition: 'prefix' },
};

export function getCurrencyInfo(currency: Currency): CurrencyInfo {
  return currencyInfoMap[currency];
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
