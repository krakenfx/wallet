import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_TOKEN_PRICE, RealmTokenPrice, TokenPrice } from './schema';

export const useTokenPriceMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const setTokenPrice = useCallback(
    (tokenPrice: TokenPrice) => {
      runInTransaction(() => {
        realm.create<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, tokenPrice, Realm.UpdateMode.Modified);
      });
    },
    [realm, runInTransaction],
  );

  return {
    setTokenPrice,
  };
};
