import { ARCHIVED_NFT } from './consts';
import { NftsCollection } from './schema';
import { useNfts } from './useNfts';

import loc from '/loc';

export const useNftsArchivedCollection = (networkFilter: string[] = []): NftsCollection => {
  const archivedNfts = useNfts(true, networkFilter);

  return {
    id: ARCHIVED_NFT,
    name: loc.nftCollection.archiveCollectionTitle,
    nfts: archivedNfts,
    walletId: ARCHIVED_NFT,
  };
};
