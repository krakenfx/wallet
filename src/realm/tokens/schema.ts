import { REALM_TYPE_ASSET_MARKET_DATA } from '../assetMarketData';
import { REALM_TYPE_ASSET_METADATA } from '../assetMetadata';
import { REALM_TYPE_TOKEN_PRICE } from '../tokenPrice';
import { REALM_TYPE_PENDING_TRANSACTION } from '../transactions';
import { REALM_TYPE_WALLET } from '../wallets';

import type { RealmAssetMarketData } from '../assetMarketData';
import type { RealmAssetMetadata } from '../assetMetadata';
import type { RealmTokenPrice } from '../tokenPrice';
import type { RealmPendingTransaction } from '../transactions';
import type { RealmWallet } from '../wallets';
import type { ObjectSchema } from 'realm';

export type Token = {
  id: string;
  assetId: string;
  walletId: string;
  balance: string;
  inGallery?: 'autoAdded' | 'manuallyAdded' | 'autoRemoved' | 'manuallyRemoved' | null;
};

export type RealmToken = RealmTypeOf<
  Token,
  {
    wallet: RealmWallet;
    price: RealmTokenPrice;
    metadata: RealmAssetMetadata;
    marketData: RealmAssetMarketData;
    pendingTransactions: Realm.List<RealmPendingTransaction>;
  }
>;

export const REALM_TYPE_TOKEN = 'Token';
export const TokenSchema: ObjectSchema = {
  name: REALM_TYPE_TOKEN,
  properties: {
    id: 'string',
    assetId: 'string',
    walletId: 'string',
    balance: 'string',
    inGallery: 'string?',
    price: {
      type: 'object',
      objectType: REALM_TYPE_TOKEN_PRICE,
    },
    wallet: {
      type: 'object',
      objectType: REALM_TYPE_WALLET,
    },
    metadata: {
      type: 'object',
      objectType: REALM_TYPE_ASSET_METADATA,
    },
    marketData: {
      type: 'object',
      objectType: REALM_TYPE_ASSET_MARKET_DATA,
    },
    pendingTransactions: {
      type: 'list',
      objectType: REALM_TYPE_PENDING_TRANSACTION,
      default: [],
    },
  },
  primaryKey: 'id',
};
