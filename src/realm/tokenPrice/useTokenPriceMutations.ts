import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_TOKEN } from '../tokens/schema';

import { REALM_TYPE_TOKEN_PRICE } from './schema';

import type { RealmTokenPrice, TokenPrice } from './schema';
import type { RealmToken } from '../tokens/schema';

export const useTokenPriceMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const setTokenPrice = useCallback(
    (tokenPrice: TokenPrice) => {
      runInTransaction(() => {
        const price = realm.create<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, tokenPrice, Realm.UpdateMode.Modified);
        const tokens = realm.objects<RealmToken>(REALM_TYPE_TOKEN).filtered('assetId in $0', [price.assetId]);
        tokens.forEach(t => {
          t.price = price;
        });
      });
    },
    [realm, runInTransaction],
  );

  return {
    setTokenPrice,
  };
};
