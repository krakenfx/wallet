import type { ObjectSchema } from 'realm';

export type AssetMetadata = {
  assetId: string;
  label: string;
  symbol: string;
  decimals: number;
  logoUrl: string | null;
  reputation: AssetReputation | null;
  updateRequired: boolean | null;
  tokenAddress?: string | null;
  subLabels?: string[] | null;
  links: AssetLink[];
  description?: string | null;
  explorers: AssetExplorer[];
};

export type RealmAssetMetadata = RealmTypeOf<
  AssetMetadata,
  {
    explorers: RealmAssetExplorer[];
    links: RealmAssetLink[];
  }
>;

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

export type AssetExplorer = {
  name: string;
  url: string;
};

export type RealmAssetExplorer = RealmTypeOf<AssetExplorer>;

export const REALM_TYPE_ASSET_EXPLORER = 'AssetExplorer';
export const AssetExplorerSchema: ObjectSchema = {
  name: REALM_TYPE_ASSET_EXPLORER,
  embedded: true,
  properties: {
    name: 'string',
    url: 'string',
  },
};

export type AssetLink = {
  name: string;
  url: string;
};
export type RealmAssetLink = RealmTypeOf<AssetLink>;
export const REALM_TYPE_ASSET_LINK = 'AssetLink';
export const AssetLinksSchema: ObjectSchema = {
  name: REALM_TYPE_ASSET_LINK,
  embedded: true,
  properties: {
    name: 'string',
    url: 'string',
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
    tokenAddress: 'string?',
    subLabels: 'string[]',
    links: {
      type: 'list',
      objectType: REALM_TYPE_ASSET_LINK,
      default: [],
    },
    description: 'string?',
    explorers: {
      type: 'list',
      objectType: REALM_TYPE_ASSET_EXPLORER,
      default: [],
    },
  },
  primaryKey: 'assetId',
};
