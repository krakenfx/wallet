import { ObjectSchema } from 'realm';

import { REALM_TYPE_PENDING_TRANSACTION, RealmPendingTransaction } from '@/realm/transactions';

import { REALM_TYPE_ASSET_METADATA, RealmAssetMetadata } from '../assetMetadata';
import { REALM_TYPE_TOKEN_PRICE, RealmTokenPrice } from '../tokenPrice';
import { REALM_TYPE_WALLET, RealmWallet } from '../wallets';

export type Token = {
  id: string;
  assetId: string;
  walletId: string;
  balance: string;
  inGallery?: boolean;
};

export type RealmToken = RealmTypeOf<
  Token,
  {
    wallet: RealmWallet;
    price: RealmTokenPrice;
    metadata: RealmAssetMetadata;
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
    inGallery: 'bool?',
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
    pendingTransactions: {
      type: 'list',
      objectType: REALM_TYPE_PENDING_TRANSACTION,
      default: [],
    },
  },
  primaryKey: 'id',
};
