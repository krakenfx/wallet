import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { useRealm } from '@/realm/RealmContext';

import { REALM_TYPE_TOKEN_PRICE_HISTORY, TokenPriceHistory } from '@/realm/tokenPrice/schema';

export const useTokenPriceHistoryMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const setTokenPriceHistory = useCallback(
    (tokenPriceHistory: TokenPriceHistory) => {
      runInTransaction(() => {
        realm.create<TokenPriceHistory>(REALM_TYPE_TOKEN_PRICE_HISTORY, tokenPriceHistory, Realm.UpdateMode.Modified);
      });
    },
    [realm, runInTransaction],
  );

  const removeAllPriceHistory = useCallback(() => {
    realm.write(() => {
      realm.delete(realm.objects(REALM_TYPE_TOKEN_PRICE_HISTORY));
    });
  }, [realm]);

  return {
    setTokenPriceHistory,
    removeAllPriceHistory,
  };
};
