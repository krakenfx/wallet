import { useQuery } from '@tanstack/react-query';

import { fetchTopVaults } from '@/api/fetchTopVaults';
import type { TopVaultsResponse } from '@/api/fetchTopVaults';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useIsOnline } from '@/utils/useConnectionManager';

const TWENTY_FOUR_HOURS = 24 * 3600000;

export const useTopVaultsQuery = <T = TopVaultsResponse>(select?: (data: TopVaultsResponse) => T) => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline) || '';
  const queryKey = 'top-vaults';

  return useQuery({
    queryKey: [queryKey, ethAddress],
    staleTime: TWENTY_FOUR_HOURS,
    gcTime: Infinity,
    queryFn: () => fetchTopVaults(ethAddress),
    select,
  });
};
