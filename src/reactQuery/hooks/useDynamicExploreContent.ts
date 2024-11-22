import { useQuery } from '@tanstack/react-query';

import { fetchDynamicExploreContent } from '@/api/fetchDynamicExploreContent';
import type { WalletData } from '@/onChain/wallets/base';
import { useWalletByType } from '@/realm/wallets/useWalletByType';

export const useDynamicExploreContent = (contentId: string, enabled: boolean) => {
  const wallet = useWalletByType('ethereum');
  const queryKey: string = `explore/${contentId}/${wallet?.id}`;

  return useQuery({
    queryKey: [queryKey],
    staleTime: 0,
    gcTime: Infinity,
    queryFn: () => fetchDynamicExploreContent(contentId, wallet as WalletData),
    enabled,
  });
};
