import { useMemo } from 'react';

import { useQuery } from '../RealmContext';
import { useRealmWallets } from '../wallets/useWallets';

import { REALM_TYPE_NFT } from './schema';

import type { RealmNft } from './schema';

export const useNfts = (archived = false, networkFilter: string[] = []) => {
  const walletIds = useRealmWallets().map(w => w.id);
  const nfts = useQuery<RealmNft>(REALM_TYPE_NFT, nft => nft.filtered("walletId IN $0 AND metadata.collectionId != ''", walletIds), [walletIds]);

  return useMemo(() => {
    const nftsFilteredByNetwork = networkFilter.length ? nfts.filtered('assetId BEGINSWITH[c] ANY $0', networkFilter) : nfts;

    return nftsFilteredByNetwork.filtered('isArchived IN $0', archived ? [true] : [false, null]);
  }, [archived, networkFilter, nfts]);
};
