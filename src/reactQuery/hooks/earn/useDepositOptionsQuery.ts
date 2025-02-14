import { useQuery } from '@tanstack/react-query';

import { fetchDepositOptions } from '@/api/earn/fetchDepositOptions';
import type { DepositOptionsResult } from '@/api/types';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useIsOnline } from '@/utils/useConnectionManager';

import { formatAssetListData, selectCardData } from './utils';

const SIX_HOURS = 6 * 3600000;

interface Params<T> {
  select?: (data: DepositOptionsResult) => T;
  networkCaipIds?: string[];
  minimumBalanceThreshold?: number;
  maxVaultsPerAsset?: number;
  minApy?: number;
}

export const useDepositOptionsQuery = <T = DepositOptionsResult>({
  select,
  networkCaipIds = [],
  minimumBalanceThreshold = 0,
  maxVaultsPerAsset = 1,
  minApy = 200,
}: Params<T>) => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline);
  const queryKey = 'deposit-options';

  return useQuery({
    enabled: !!ethAddress,
    queryKey: [queryKey, ethAddress, networkCaipIds, minimumBalanceThreshold, maxVaultsPerAsset, minApy],
    staleTime: SIX_HOURS,
    gcTime: Infinity,

    queryFn: () => fetchDepositOptions({ address: ethAddress!, networkCaipIds, minimumBalanceThreshold, maxVaultsPerAsset, minApy }),
    select,
  });
};

interface UseDepositOptionsCardDataQueryProps {
  minimumBalanceThreshold?: number;
  maxVaultsPerAsset?: number;
}

export const useDepositOptionsCardDataQuery = ({ minimumBalanceThreshold, maxVaultsPerAsset }: UseDepositOptionsCardDataQueryProps = {}) =>
  useDepositOptionsQuery({ select: selectCardData, minimumBalanceThreshold, maxVaultsPerAsset });

export const useFilteredDepositOptionsByAssetQuery = (networkCaipIds: string[]) =>
  useDepositOptionsQuery({ networkCaipIds, maxVaultsPerAsset: 5, minimumBalanceThreshold: 1, select: formatAssetListData });
