import type { AssetBalanceId } from '@/types';

import { useObject } from '../RealmContext';

import { REALM_TYPE_TOKEN } from './schema';

import type { RealmToken } from './schema';

export const useTokenById = <T extends string | undefined>(id: T) => {
  return useObject<RealmToken, T>(REALM_TYPE_TOKEN, id, 'id');
};

export const useTokenByAssetId = (assetId: string, walletId: string) => {
  return useObject<RealmToken>(REALM_TYPE_TOKEN, `${walletId}:${assetId}`, 'id');
};

export function useResolvedAssetBalance(balance: AssetBalanceId | undefined) {
  let walletId, assetId, stringBalanceId;
  const token = useTokenById(typeof balance === 'string' ? balance : undefined);

  if (balance === undefined) {
    return [undefined, undefined, undefined];
  }

  if (typeof balance === 'string') {
    if (!token) {
      throw new Error('asset balance not found in database');
    }
    walletId = token.walletId;
    assetId = token.assetId;
    stringBalanceId = token.id;
  }

  if (typeof balance === 'object' && 'walletId' in balance) {
    walletId = balance.walletId;
    assetId = balance.assetId;
    stringBalanceId = `${balance.walletId}:${balance.assetId}`;
  }

  return [walletId, assetId, stringBalanceId] as const;
}
