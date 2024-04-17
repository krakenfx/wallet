import { ObjectSchema } from 'realm';

export type FiatValue = {
  value?: string;
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
