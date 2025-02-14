import { useCallback, useMemo } from 'react';

import type { KrakenAsset, KrakenAssetSupported } from '@/api/krakenConnect/types';

import { useKrakenConnectAssets } from './useKrakenConnectAssets';

export const useGetKrakenSupportedAsset = (assetSymbol?: string) => {
  const { data } = useKrakenConnectAssets();

  const getKrakenSupportedAsset = useCallback(
    (assetSymbol: string): KrakenAsset | undefined => {
      if (data) {
        const asset = data.find(asset => asset.symbol === assetSymbol && asset.isSupported);
        return asset as KrakenAssetSupported;
      }
    },
    [data],
  );

  const krakenAsset = useMemo(
    () => (assetSymbol ? (getKrakenSupportedAsset(assetSymbol) as KrakenAssetSupported) : undefined),
    [assetSymbol, getKrakenSupportedAsset],
  );

  return {
    getKrakenSupportedAsset,
    krakenAsset,
  };
};
