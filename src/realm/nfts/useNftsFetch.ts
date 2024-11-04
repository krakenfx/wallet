import { useCallback, useRef } from 'react';

import type { NftWithCachedMetadata } from '@/api/fetchNfts';
import { fetchNfts } from '@/api/fetchNfts';
import { fetchRawNftMetadata } from '@/api/fetchRawNftMetadata';
import type { NFT } from '@/api/types';
import type { RealmNftMetadata } from '@/realm/nftMetadata';
import { REALM_TYPE_NFT_METADATA } from '@/realm/nftMetadata';
import { useNftsMutations } from '@/realm/nfts/useNftsMutations';
import { useRealm } from '@/realm/RealmContext';
import { getWalletsForMutations } from '@/realm/wallets';
import { isPromiseFulfilled, isPromiseRejected } from '@/utils/promise';

import { useRealmTransaction } from '../hooks/useRealmTransaction';

import { handleError } from '/helpers/errorHandler';

type FetchState = {
  isLoading: boolean;
  refreshMetadata?: boolean;
};

export const useNftsFetch = () => {
  const realm = useRealm();
  const { saveNftsToRealm } = useNftsMutations();
  const { runInTransaction } = useRealmTransaction();
  const fetchState = useRef<FetchState>();

  const getRawNftMetadata = useCallback(
    (nft: NFT) => {
      const currentMetadata = realm.objectForPrimaryKey<RealmNftMetadata>(REALM_TYPE_NFT_METADATA, nft.token);
      if (!fetchState.current?.refreshMetadata && currentMetadata) {
        return new Promise<NftWithCachedMetadata>(resolve =>
          resolve({
            ...nft,
            metadata: currentMetadata,
            metadataType: 'cached',
          }),
        );
      }
      return fetchRawNftMetadata(nft);
    },
    [realm],
  );

  const fetchAndUpdateNfts = useCallback(
    async (refreshMetadata?: boolean) => {
      if (fetchState.current?.isLoading) {
        return;
      }
      fetchState.current = {
        refreshMetadata,
        isLoading: true,
      };
      const accountWallets = getWalletsForMutations(realm);

      const results = await Promise.allSettled(accountWallets.map(wallet => fetchNfts(wallet, getRawNftMetadata).then(nfts => ({ nfts, wallet }))));
      const nftsFetched = results.filter(isPromiseFulfilled).map(({ value }) => value);
      runInTransaction(() => {
        nftsFetched.forEach(({ nfts, wallet }) => {
          
          if (wallet.isValid()) {
            saveNftsToRealm(nfts, wallet);
          }
        });
      });
      results.filter(isPromiseRejected).forEach(({ reason }) => handleError(reason, 'ERROR_CONTEXT_PLACEHOLDER'));
      fetchState.current.isLoading = false;
    },
    [realm, runInTransaction, getRawNftMetadata, saveNftsToRealm],
  );

  return {
    fetchAndUpdateNfts,
  };
};
