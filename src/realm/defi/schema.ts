import { REALM_TYPE_WALLET } from '../wallets';

import type { RealmWallet } from '../wallets';
import type { ObjectSchema } from 'realm';

export type DefiSublabel = {
  label: string | number;
  type?: 'dollar' | 'pct';
};
export const REALM_TYPE_DEFI_SUBLABEL = 'DefiSublabel';
export const DefiSublabelSchema: ObjectSchema = {
  name: REALM_TYPE_DEFI_SUBLABEL,
  embedded: true,
  properties: {
    label: 'mixed',
    type: 'string?',
  },
};

export interface DefiAncillaryStat {
  label: string;
  value: number | string;
  type?: 'string' | 'number' | 'dollar' | 'pct' | 'translation';
}
export const REALM_TYPE_DEFI_ANCILLARY_STAT = 'DefiAncillaryStat';
export const DefiAncillaryStatSchema: ObjectSchema = {
  name: REALM_TYPE_DEFI_ANCILLARY_STAT,
  embedded: true,
  properties: {
    label: 'string',
    value: 'mixed',
    type: 'string?',
  },
};

export interface DefiPositionMetadata {
  label?: string;
  subLabels?: DefiSublabel[];
  imageUrls: string[];
  pricePerShare: number[];
  ancillaryStats: DefiAncillaryStat[];
}
export const REALM_TYPE_DEFI_POSITION_METADATA = 'DefiPositionMetadata';
export const DefiPositionMetadataSchema: ObjectSchema = {
  embedded: true,
  name: REALM_TYPE_DEFI_POSITION_METADATA,
  properties: {
    label: 'string?',
    subLabels: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_SUBLABEL,
      default: [],
    },
    imageUrls: {
      type: 'list',
      objectType: 'string',
      default: [],
    },
    pricePerShare: {
      type: 'list',
      objectType: 'double',
      default: [],
    },
    ancillaryStats: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_ANCILLARY_STAT,
      default: [],
    },
  },
};

export type DefiToken = {
  address: string;
  network: DefiNetwork;
  symbol: string;
  decimals: number;
  price: number;
  balance?: number;
  balanceUsdValue?: number;
  tokens?: DefiToken[];
};

export const REALM_TYPE_DEFI_TOKEN_NESTED = 'DefiTokenNested';
export const DefiTokenNestedSchema: ObjectSchema = {
  embedded: true,
  name: REALM_TYPE_DEFI_TOKEN_NESTED,
  properties: {
    address: 'string',
    network: 'string',
    symbol: 'string',
    decimals: 'int',
    price: 'double',
    balance: 'double?',
    balanceUsdValue: 'double?',
  },
};

export type RealmDefiToken = RealmTypeOf<DefiToken>;
export const REALM_TYPE_DEFI_TOKEN = 'DefiToken';
export const DefiTokenSchema: ObjectSchema = {
  embedded: true,
  name: REALM_TYPE_DEFI_TOKEN,
  properties: {
    address: 'string',
    network: 'string',
    symbol: 'string',
    decimals: 'int',
    price: 'double',
    balance: 'double?',
    balanceUsdValue: 'double?',
    tokens: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_TOKEN_NESTED,
      default: [],
    },
  },
};

export type DefiPosition = {
  type: 'app-token' | 'contract-position';
  network: DefiNetwork;
  address: string;
  category: string;
  usdValue: number | string;
  tokens: DefiToken[];
  metadata: DefiPositionMetadata;
};
export type RealmDefiPosition = RealmTypeOf<DefiPosition>;
export const REALM_TYPE_DEFI_POSITION = 'DefiPosition';
export const DefiPositionsSchema: ObjectSchema = {
  name: REALM_TYPE_DEFI_POSITION,
  embedded: true,
  properties: {
    type: 'string',
    network: 'string',
    address: 'string',
    category: 'string',
    usdValue: 'mixed',
    tokens: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_TOKEN,
      default: [],
    },
    metadata: 'DefiPositionMetadata?',
  },
};

export type DefiProduct = {
  label: string;
  positions: DefiPosition[];
  metadata: DefiAncillaryStat[];
};
export type RealmDefiProduct = RealmTypeOf<DefiProduct>;
export const REALM_TYPE_DEFI_PRODUCT = 'DefiProduct';
export const DefiProductsSchema: ObjectSchema = {
  name: REALM_TYPE_DEFI_PRODUCT,
  embedded: true,
  properties: {
    label: 'string',
    positions: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_POSITION,
      default: [],
    },
    metadata: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_ANCILLARY_STAT,
      default: [],
    },
  },
};

export type DefiNetwork =
  | 'ethereum'
  | 'polygon'
  | 'optimism'
  | 'gnosis'
  | 'binance-smart-chain'
  | 'fantom'
  | 'avalanche'
  | 'arbitrum'
  | 'celo'
  | 'harmony'
  | 'moonriver'
  | 'bitcoin'
  | 'cronos'
  | 'aurora'
  | 'evmos'
  | 'base';

export type Defi = {
  id: string;
  address: string;
  network: DefiNetwork;
  protocolId: string;
  protocolName: string;
  protocolUsdBalance: number;
  protocolImageUrl?: string;
  products: DefiProduct[];
  walletId: string;
};

export type RealmDefi = RealmTypeOf<Defi, { wallet: RealmWallet }>;

export const REALM_TYPE_DEFI = 'Defi';
export const DefiSchema: ObjectSchema = {
  name: REALM_TYPE_DEFI,
  properties: {
    id: 'string',
    address: 'string',
    network: 'string',
    protocolId: 'string',
    protocolName: 'string',
    protocolUsdBalance: 'double',
    protocolImageUrl: 'string?',
    products: {
      type: 'list',
      objectType: REALM_TYPE_DEFI_PRODUCT,
    },
    walletId: 'string',
    wallet: {
      type: 'object',
      objectType: REALM_TYPE_WALLET,
    },
  },
  primaryKey: 'id',
};
