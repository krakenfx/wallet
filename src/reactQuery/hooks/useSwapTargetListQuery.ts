import { useQuery } from '@tanstack/react-query';

import { fetchSwapToTokenList } from '@/api/fetchSwapTokenLists';

export const useSwapTargetListQuery = (fromNetwork?: string, shortList?: boolean, staleTime?: number) => {
  async function getTokenList(fromNetwork?: string, fetchShortList = true) {
    if (!fromNetwork) {
      throw new Error('[fromNetwork] needs to be defined');
    }
    return fetchSwapToTokenList(fromNetwork, fetchShortList);
  }

  return useQuery({
    queryKey: ['swapTargetList', fromNetwork, shortList],
    queryFn: () => getTokenList(fromNetwork, shortList),
    staleTime,
    gcTime: Infinity,
    enabled: Boolean(fromNetwork),
  });
};
