import type { ObjectSchema } from 'realm';

export type FiatValue = {
  value?: string;
  changePercentage24HR?: string;
  source: string;
};

export type TokenPrice = {
  assetId: string;
  fiatValue: { [iso: string]: FiatValue };
};

export const REALM_TYPE_TOKEN_PRICE_FIAT_CURRENCY = 'TokenPriceFiatCurrency';
export const TokenPriceFiatCurrencySchema: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE_FIAT_CURRENCY,
  embedded: true,
  properties: {
    value: 'string',
    changePercentage24HR: 'string?',
    source: 'string',
  },
};

export const REALM_TYPE_TOKEN_PRICE_FIAT_VALUE = 'TokenPriceFiatValue';
export const TokenPriceFiatValueSchema: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE_FIAT_VALUE,
  embedded: true,
  properties: {
    values: 'mixed',
  },
};

export const REALM_TYPE_TOKEN_PRICE = 'TokenPrice';
export const TokenPriceSchema: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE,
  properties: {
    assetId: 'string',
    fiatValue: {
      type: 'dictionary',
      objectType: REALM_TYPE_TOKEN_PRICE_FIAT_CURRENCY,
    },
  },
  primaryKey: 'assetId',
};

export type RealmTokenPrice = RealmTypeOf<TokenPrice>;

export type TokenPriceHistoryItem = {
  timestamp: number;
  value: number;
};

export const REALM_TYPE_TOKEN_PRICE_HISTORY_ITEM = 'TokenPriceHistoryItem';

export const TokenPriceHistoryItemSchema: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE_HISTORY_ITEM,
  embedded: true,
  properties: {
    timestamp: 'int',
    value: 'double',
  },
};
export type RealmTokenPriceHistoryItem = RealmTypeOf<TokenPriceHistoryItem>;

export const REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM = 'TokenPriceHighLowItem';
export const TokenPriceHighLowItem: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM,
  embedded: true,
  properties: {
    high: 'double',
    low: 'double',
  },
};
export type TokenPriceHighLowItem = {
  high: number;
  low: number;
};

export const REALM_TYPE_TOKEN_PRICE_HIGH_LOW = 'TokenPriceHighLow';
export const TokenPriceHighLow: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE_HIGH_LOW,
  embedded: true,
  properties: {
    day: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM,
      optional: true,
    },
    week: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM,
      optional: true,
    },
    month: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM,
      optional: true,
    },
    year: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM,
      optional: true,
    },
    all: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE_HIGH_LOW_ITEM,
      optional: true,
    },
  },
};
export type TokenPriceHighLow = {
  day?: TokenPriceHighLowItem;
  week?: TokenPriceHighLowItem;
  month?: TokenPriceHighLowItem;
  year?: TokenPriceHighLowItem;
  all?: TokenPriceHighLowItem;
};

export type RealmTokenPriceHighLow = RealmTypeOf<TokenPriceHighLow>;

export type PriceHistoryPeriod = 'ALL' | 'YEAR' | 'MONTH' | 'WEEK' | 'DAY';

export type TokenPriceHistory = {
  assetId: string;
  prices: TokenPriceHistoryItem[];
  period: PriceHistoryPeriod;
  priceHistoryId: string;
  highLow?: TokenPriceHighLow;
  updatedAt: Date;
};

export type RealmTokenPriceHistory = RealmTypeOf<TokenPriceHistory>;

export const REALM_TYPE_TOKEN_PRICE_HISTORY = 'TokenPriceHistory';

export const TokenPriceHistorySchema: ObjectSchema = {
  name: REALM_TYPE_TOKEN_PRICE_HISTORY,
  properties: {
    priceHistoryId: 'string',
    assetId: 'string',
    period: 'string',
    updatedAt: 'date',
    prices: {
      type: 'list',
      objectType: REALM_TYPE_TOKEN_PRICE_HISTORY_ITEM,
      default: [],
    },
    highLow: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE_HIGH_LOW,
      optional: true,
    },
  },
  primaryKey: 'priceHistoryId',
};
