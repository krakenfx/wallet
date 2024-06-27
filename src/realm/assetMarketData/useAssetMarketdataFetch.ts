import { useCallback } from 'react';

import { fetchAssetMarketData } from '@/api/fetchAssetMarketData';

import { useAppCurrency } from '../settings';

import { useAssetMarketDataMutations } from './useAssetMarketDataMutations';

export const useAssetMarketdataFetch = (assetId?: string) => {
  const { setAssetMarketData } = useAssetMarketDataMutations();
  const { currency } = useAppCurrency();

  const fetchAndSetData = useCallback(async () => {
    if (assetId) {
      const data = await fetchAssetMarketData(assetId, currency);
      if (data) {
        setAssetMarketData(data);
      }
    }
  }, [assetId, currency, setAssetMarketData]);

  return {
    fetchAndSetData,
  };
};
