import { ObjectSchema } from 'realm';

export type FiatRates = {
  iso: string;
  value: string;
};

export const REALM_TYPE_FIAT_RATES = 'UsdFiatRates';
export const UsdFiatRatesSchema: ObjectSchema = {
  name: REALM_TYPE_FIAT_RATES,
  properties: {
    iso: 'string',
    value: 'string',
  },
  primaryKey: 'iso',
};

export type RealmFiatRates = RealmTypeOf<FiatRates>;
