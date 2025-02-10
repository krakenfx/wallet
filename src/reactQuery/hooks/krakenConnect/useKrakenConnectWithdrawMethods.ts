import { useQuery } from '@tanstack/react-query';

import { fetchWithdrawMethods } from '@/api/krakenConnect/fetchWithdrawMethods';
import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

import { getSupportedMethods } from './utils';

interface Params {
  asset: KrakenAssetSupported;
}

export const useKrakenConnectWithdrawMethods = ({ asset }: Params) => {
  const { API_SECRET, API_KEY, CF_TOKEN } = useKrakenConnectCredentials();
  return useQuery({
    queryKey: ['krakenConnectWithdrawMethods', asset.symbol],
    queryFn: async () => {
      const methods = await fetchWithdrawMethods({
        assetSymbol: asset.symbol,
        cfToken: CF_TOKEN,
        apiKey: API_KEY,
        privateKey: API_SECRET,
      });
      return getSupportedMethods(methods, asset);
    },
  });
};
