import { useQuery } from '@tanstack/react-query';

import { fetchTopOpportunity } from '@/api/earn/fetchTopOpportunity';
import type { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useIsOnline } from '@/utils/useConnectionManager';

import { ONE_HOUR } from './consts';
import { formatTopOpportunity } from './utils';

interface Params {
  networkCaipId: ChainAgnostic;
}

export const useTopOpportunityQuery = ({ networkCaipId }: Params) => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline);
  const queryKey = 'top-opportunity';

  return useQuery({
    enabled: !!ethAddress,
    queryKey: [queryKey, ethAddress, networkCaipId],
    staleTime: ONE_HOUR,
    gcTime: Infinity,
    select: formatTopOpportunity,

    queryFn: () => fetchTopOpportunity({ address: ethAddress!, networkCaipId }),
  });
};
