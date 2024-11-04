import { useEffect, useMemo, useState } from 'react';

import type { AnalyseAddressResult } from '@/api/types';
import type { Network } from '@/onChain/wallets/base';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { evmHarmonyTransport } from '@/onChain/wallets/registry';
import { useRealm } from '@/realm/RealmContext';
import { getWalletsForMutations } from '@/realm/wallets';
import type { ColorName } from '@/theme/themes';

import { parseAddressAnalysis } from '../utils/parseAddressAnalysis';

import type { NetworkFilter } from '../utils/parseAddressAnalysis';

import { handleError } from '/helpers/errorHandler';

export type AddressAnalysis = {
  toAddress: string;
  result: ReturnType<typeof parseAddressAnalysis>;
  isLoading: boolean;
  accentColor?: ColorName;
  data: AnalyseAddressResult[];
};

export function useAddressAnalysis(network: Network, toAddress: string, cache?: AnalyseAddressResult[], networkFilter?: NetworkFilter): AddressAnalysis {
  const [isLoading, setIsLoading] = useState(false);
  const realm = useRealm();

  const [data, setData] = useState<AnalyseAddressResult[]>([]);

  const shouldUseCache = useMemo(() => !!cache && cache.length > 0 && cache[0].address === toAddress, [cache, toAddress]);

  useEffect(() => {
    async function analyseAddress(evmNetwork: EVMNetwork) {
      const evmWallet = getWalletsForMutations(realm).filtered("type == 'ethereum'")[0];
      setIsLoading(true);
      try {
        const result = await evmHarmonyTransport.analyseAddress(evmNetwork, evmWallet, toAddress);
        setData(result.content);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      } finally {
        setIsLoading(false);
      }
    }
    if (toAddress && !shouldUseCache && network instanceof EVMNetwork && network.isAddressValid(toAddress)) {
      analyseAddress(network);
    } else {
      setData([]);
    }
  }, [network, realm, shouldUseCache, toAddress]);

  const result = useMemo(() => parseAddressAnalysis(cache && shouldUseCache ? cache : data, networkFilter), [cache, data, networkFilter, shouldUseCache]);

  const accentColor: ColorName | undefined = useMemo(() => {
    if (!result?.warning) {
      return;
    }
    switch (result.warning.severity) {
      case 'CRITICAL':
        return 'red400';
      case 'WARNING':
        return 'yellow500';
      default:
        return undefined;
    }
  }, [result?.warning]);

  return {
    toAddress,
    result,
    isLoading,
    accentColor,
    data,
  };
}
