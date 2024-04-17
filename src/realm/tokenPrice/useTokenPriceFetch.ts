import { uniqBy } from 'lodash';
import { useCallback, useRef } from 'react';
import Realm from 'realm';

import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { isPromiseFulfilled, isPromiseRejected } from '@/utils/promise';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';
import { REALM_TYPE_TOKEN, RealmToken } from '../tokens';

import { REALM_TYPE_TOKEN_PRICE, RealmTokenPrice } from './schema';

import { handleError } from '/helpers/errorHandler';

export const useTokenPriceFetch = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();
  const isFetchingAll = useRef<boolean>(false);

  const fetchAllTokenPrices = useCallback(async (): Promise<boolean> => {
    if (isFetchingAll.current) {
      return true;
    }
    isFetchingAll.current = true;
    const tokens = realm.objects<RealmToken>(REALM_TYPE_TOKEN);
    const results = await Promise.allSettled(uniqBy(tokens, 'assetId').map(token => fetchPriceForToken(token.assetId)));
    const fetchedPrices = results.filter(isPromiseFulfilled).map(({ value }) => value);

    runInTransaction(() => {
      for (const priceOutput of fetchedPrices) {
        const price = realm.create<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, priceOutput, Realm.UpdateMode.Modified);

        tokens
          .filter(t => t.assetId === priceOutput.assetId)
          .forEach(token => {
            token.price = price;
          });
      }
    });

    results.filter(isPromiseRejected).forEach(({ reason }) => handleError(reason, 'ERROR_CONTEXT_PLACEHOLDER'));
    isFetchingAll.current = false;

    return results.length === fetchedPrices.length;
  }, [realm, runInTransaction]);

  return {
    fetchAllTokenPrices,
  };
};
