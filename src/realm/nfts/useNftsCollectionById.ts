import { useMemo } from 'react';

import { ARCHIVED_NFT } from './consts';
import { useNftsArchivedCollection } from './useNftsArchivedCollection';
import { useNftsCollections } from './useNftsCollections';

export const useNftsCollectionById = (collectionId: string) => {
  const nftsCollections = useNftsCollections();
  const archivedNftsCollection = useNftsArchivedCollection();

  return useMemo(() => {
    if (collectionId === ARCHIVED_NFT) {
      return archivedNftsCollection;
    }
    return nftsCollections.find(collection => collection.id === collectionId);
  }, [archivedNftsCollection, collectionId, nftsCollections]);
};
