import { useQuery } from '@tanstack/react-query';

import { fetchDefiPositions } from '@/api/earn/fetchDefiPositions';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useFeatureFlag } from '@/unencrypted-realm/featureFlags/useFeatureFlag';
import { useIsOnline } from '@/utils/useConnectionManager';

import { mapDefiProtocols } from './utils';

const TEN_MINUTES = 10 * 60000;

export const useDefiPositionsQuery = () => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline);
  const queryKey = 'defi-positions';

  const [isEarnEnabled] = useFeatureFlag('earnEnabled');

  return useQuery({
    enabled: !!ethAddress,
    queryKey: [queryKey, ethAddress],
    staleTime: TEN_MINUTES,
    gcTime: Infinity,
    select: mapDefiProtocols,

    queryFn: () => (isEarnEnabled ? fetchDefiPositions(ethAddress!) : []),
  });
};
