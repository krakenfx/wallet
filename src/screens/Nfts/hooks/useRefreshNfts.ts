import { useCallback, useState } from 'react';

import { useNftsFetch } from '@/realm/nfts';

export const useRefreshNfts = () => {
  const { fetchAndUpdateNfts } = useNftsFetch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshNfts = useCallback(
    async (refreshMetadata?: boolean) => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        await fetchAndUpdateNfts(refreshMetadata);
        setIsRefreshing(false);
      }
    },
    [fetchAndUpdateNfts, isRefreshing],
  );

  return {
    refreshNfts,
    isRefreshing,
  };
};
