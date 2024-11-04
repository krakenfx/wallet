import type { NativeTokenSymbol } from '@/onChain/wallets/base';
import type { WalletType } from '@/onChain/wallets/registry';

import type { ObjectSchema } from 'realm';

export type Wallet = {
  id: string;
  type: WalletType;
  accountIdx: number;
  caipId: string;
  nativeTokenSymbol: NativeTokenSymbol;
  nativeTokenCaipId: string;
  nativeTokenDecimals: number;
  nativeTokenLabel?: string;
  extendedPublicKey: ArrayBuffer;
  chainCode?: ArrayBuffer;
};

export type RealmWallet = RealmTypeOf<Wallet>;

export const REALM_TYPE_WALLET = 'Wallet';
export const WalletSchema: ObjectSchema = {
  name: REALM_TYPE_WALLET,
  properties: {
    id: 'string',
    type: 'string',
    accountIdx: 'int',
    caipId: 'string',
    nativeTokenSymbol: 'string',
    nativeTokenCaipId: 'string',
    nativeTokenDecimals: 'int',
    nativeTokenLabel: 'string?',
    extendedPublicKey: 'data',
    chainCode: 'data?',
  },
  primaryKey: 'id',
};

export type WalletState = {
  id: string;
  serialized?: string;
};

export type RealmWalletState = RealmTypeOf<WalletState>;

export const REALM_TYPE_WALLET_STATE = 'WalletState';
export const WalletStateSchema: ObjectSchema = {
  name: REALM_TYPE_WALLET_STATE,
  properties: {
    id: 'string',
    serialized: 'string?',
  },
  primaryKey: 'id',
};

export type WalletAddressCacheItem = {
  id: string;
  walletId: string;
  key: string;
  address: string;
};

export type RealmWalletCacheItem = RealmTypeOf<WalletAddressCacheItem>;
export const REALM_TYPE_WALLET_ADDRESS_CACHE = 'WalletAddressCache';
export const WalletAddressCacheSchema: ObjectSchema = {
  name: REALM_TYPE_WALLET_ADDRESS_CACHE,
  properties: {
    walletId: 'string',
    key: 'string',
    address: 'string',
  },
};
