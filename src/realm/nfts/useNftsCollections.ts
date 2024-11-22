import { groupBy } from 'lodash';
import { useMemo } from 'react';

import { useNfts } from './useNfts';

import type { NftsCollection } from './schema';

export const useNftsCollections = (networkFilter: string[] = []): NftsCollection[] => {
  const nfts = useNfts(false, networkFilter);

  return useMemo(() => {
    const groupedNfts = groupBy(nfts, 'metadata.collectionId');
    return Object.entries(groupedNfts).map(([id, groupedNftEntry]): NftsCollection => {
      const {
        metadata: { collectionName, collectionImageUrl },
        walletId,
      } = groupedNftEntry[0];
      return {
        id,
        name: collectionName,
        imageUrl: collectionImageUrl,
        nfts: groupedNfts[id],
        walletId,
      };
    });
  }, [nfts]);
};
