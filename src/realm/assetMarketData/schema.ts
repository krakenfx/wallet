import { ObjectSchema } from 'realm';

export type AssetMarketDataPercentageChange = Record<'hour' | 'day' | 'week' | 'month' | 'year' | 'all', number | undefined>;

export const REALM_TYPE_ASSET_MARKET_DATA_PERCENTAGE_CHANGE = 'AssetMarketDataPercentageChange';
export const AssetMarketDataPercentageChangeSchema: ObjectSchema = {
  name: REALM_TYPE_ASSET_MARKET_DATA_PERCENTAGE_CHANGE,
  embedded: true,
  properties: {
    hour: 'double?',
    day: 'double?',
    week: 'double?',
    month: 'double?',
    year: 'double?',
    all: 'double?',
  },
};

export type AssetMarketData = {
  assetId: string;
  allTimeHigh?: number;
  allTimeLow?: number;
  fullyDilutedValuation?: number;
  marketCap?: number;
  circulatingSupply?: number;
  maxSupply?: number;
  totalSupply?: number;
  priceChange24HR?: number;
  priceHigh24HR?: number;
  priceLow24HR?: number;
  volume24HR?: number;
  priceChangePercentage: AssetMarketDataPercentageChange;
};

export type RealmAssetMarketData = RealmTypeOf<AssetMarketData>;

export const REALM_TYPE_ASSET_MARKET_DATA = 'AssetMarketData';

export const AssetMarketDataSchema: ObjectSchema = {
  name: REALM_TYPE_ASSET_MARKET_DATA,
  properties: {
    assetId: 'string',
    allTimeHigh: 'double?',
    allTimeLow: 'double?',
    fullyDilutedValuation: 'double?',
    marketCap: 'double?',
    circulatingSupply: 'double?',
    maxSupply: 'double?',
    totalSupply: 'double?',
    priceChange24HR: 'double?',
    priceHigh24HR: 'double?',
    priceLow24HR: 'double?',
    volume24HR: 'double?',
    priceChangePercentage: {
      type: 'object',
      objectType: REALM_TYPE_ASSET_MARKET_DATA_PERCENTAGE_CHANGE,
    },
  },
  primaryKey: 'assetId',
};
