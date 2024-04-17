import { ObjectSchema } from 'realm';

export type AssetMetadata = {
  assetId: string;
  label: string;
  symbol: string;
  decimals: number;
  logoUrl: string | null;
  reputation: AssetReputation | null;
  updateRequired: boolean | null;
};

export type RealmAssetMetadata = RealmTypeOf<AssetMetadata>;

export interface AssetReputation {
  whitelists: string[];
  blacklists: string[];
}

export const REALM_TYPE_ASSET_REPUTATION = 'AssetReputation';
export const AssetReputationSchema = {
  name: REALM_TYPE_ASSET_REPUTATION,
  embedded: true,
  properties: {
    whitelists: 'string[]',
    blacklists: 'string[]',
  },
};

export const REALM_TYPE_ASSET_METADATA = 'AssetMetadata';
export const AssetMetadataSchema: ObjectSchema = {
  name: REALM_TYPE_ASSET_METADATA,
  properties: {
    assetId: 'string',
    label: 'string',
    symbol: 'string',
    decimals: 'int',
    logoUrl: 'string?',
    reputation: 'AssetReputation?',
    updateRequired: 'bool?',
  },
  primaryKey: 'assetId',
};
