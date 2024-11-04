import { useCallback, useRef } from 'react';
import Realm from 'realm';

import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { isPromiseFulfilled, isPromiseRejected } from '@/utils/promise';

import { useCurrentAccountNumber } from '../accounts';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_TOKEN } from '../tokens';

import { REALM_TYPE_TOKEN_PRICE } from './schema';
import { checkTokenGalleryChange } from './utils';

import type { RealmTokenPrice } from './schema';
import type { RealmToken } from '../tokens';

import { handleError } from '/helpers/errorHandler';

export const useTokenPriceFetch = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();
  const isFetching = useRef<boolean>(false);
  const currentAccountNumber = useCurrentAccountNumber();

  const fetchTokenPrices = useCallback(async (): Promise<boolean> => {
    if (isFetching.current) {
      return true;
    }
    isFetching.current = true;
    const tokens = realm.objects<RealmToken>(REALM_TYPE_TOKEN).filtered('wallet.accountIdx == $0', [currentAccountNumber]);
    const results = await Promise.allSettled(tokens.map(token => fetchPriceForToken(token.assetId)));
    const fetchedPrices = results.filter(isPromiseFulfilled).map(({ value }) => value);

    runInTransaction(() => {
      for (const priceOutput of fetchedPrices) {
        const price = realm.create<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, priceOutput, Realm.UpdateMode.Modified);
        tokens
          .filter(t => t.assetId === priceOutput.assetId)
          .forEach(token => {
            token.price = price;
            const galleryStatus = checkTokenGalleryChange(token, price);
            if (galleryStatus) {
              token.inGallery = galleryStatus;
            }
          });
      }
    });

    results.filter(isPromiseRejected).forEach(({ reason }) => handleError(reason, 'ERROR_CONTEXT_PLACEHOLDER'));
    isFetching.current = false;

    return results.length === fetchedPrices.length;
  }, [currentAccountNumber, realm, runInTransaction]);

  return {
    fetchTokenPrices,
  };
};
