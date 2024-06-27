import { useCallback, useRef } from 'react';
import Realm from 'realm';

import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { isPromiseFulfilled, isPromiseRejected } from '@/utils/promise';

import { useCurrentAccountNumber } from '../accounts';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';
import { REALM_TYPE_TOKEN, RealmToken } from '../tokens';

import { useIsTokenRelevant } from './isTokenRelevant';
import { REALM_TYPE_TOKEN_PRICE, RealmTokenPrice } from './schema';

import { handleError } from '/helpers/errorHandler';

export const useTokenPriceFetch = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();
  const isFetching = useRef<boolean>(false);
  const isTokenRelevant = useIsTokenRelevant();
  const currentAccountNumber = useCurrentAccountNumber();

  const fetchRelevantTokenPrices = useCallback(async (): Promise<boolean> => {
    if (isFetching.current) {
      return true;
    }
    isFetching.current = true;
    const tokens = realm.objects<RealmToken>(REALM_TYPE_TOKEN).filtered('wallet.accountIdx == $0', [currentAccountNumber]);
    const relevantTokens = tokens.filter(isTokenRelevant);
    const results = await Promise.allSettled(relevantTokens.map(token => fetchPriceForToken(token.assetId)));
    const fetchedPrices = results.filter(isPromiseFulfilled).map(({ value }) => value);

    runInTransaction(() => {
      for (const priceOutput of fetchedPrices) {
        const price = realm.create<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, priceOutput, Realm.UpdateMode.Modified);
        relevantTokens
          .filter(t => t.assetId === priceOutput.assetId)
          .forEach(token => {
            token.price = price;
          });
      }
    });

    results.filter(isPromiseRejected).forEach(({ reason }) => handleError(reason, 'ERROR_CONTEXT_PLACEHOLDER'));
    isFetching.current = false;

    return results.length === fetchedPrices.length;
  }, [currentAccountNumber, isTokenRelevant, realm, runInTransaction]);

  return {
    fetchRelevantTokenPrices,
  };
};
