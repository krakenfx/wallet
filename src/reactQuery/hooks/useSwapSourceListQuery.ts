import { useQuery } from '@tanstack/react-query';

import { fetchSwapFromTokenList } from '@/api/fetchSwapTokenLists';

export const useSwapSourceListQuery = (caipIds: string[], staleTime?: number) => {
  async function getTokenList() {
    return fetchSwapFromTokenList(caipIds);
  }

  return useQuery({
    queryKey: ['swapSourceList', caipIds],
    queryFn: getTokenList,
    staleTime,
    gcTime: Infinity,
    select: data => {
      if (data.fromTokens) {
        const supportedAssets: string[] = [];
        Object.entries(data.fromTokens).forEach(([_, dict]) => {
          Object.keys(dict).map(assetId => {
            supportedAssets.push(assetId);
          });
        });
        return supportedAssets;
      }
    },
  });
};
