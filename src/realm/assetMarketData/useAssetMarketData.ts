import { useEffect, useMemo, useRef } from 'react';

import { fetchAssetMarketData } from '@/api/fetchAssetMarketData';
import { useObject } from '@/realm/RealmContext';
import { useAppCurrency } from '@/realm/settings';

import { REALM_TYPE_ASSET_MARKET_DATA } from './schema';
import { useAssetMarketDataMutations } from './useAssetMarketDataMutations';

import type { RealmAssetMarketData } from './schema';

import { createErrorHandlerWithContext } from '/helpers/errorHandler';

interface Props {
  assetId: string;
  refresh?: boolean;
}

export const useAssetMarketData = ({ assetId, refresh }: Props) => {
  const currentAssetMarketData = useObject<RealmAssetMarketData>(REALM_TYPE_ASSET_MARKET_DATA, assetId, 'assetId');
  const { setAssetMarketData } = useAssetMarketDataMutations();
  const { currency } = useAppCurrency();

  const didFetch = useRef<boolean>();

  useEffect(() => {
    const fetchAndSetMarketData = async () => {
      const assetMarketData = await fetchAssetMarketData(assetId, currency);
      if (assetMarketData) {
        setAssetMarketData(assetMarketData);
      }
    };
    if (assetId && !didFetch.current && (refresh || !currentAssetMarketData)) {
      didFetch.current = true;
      fetchAndSetMarketData().catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));
    }
  }, [assetId, currency, currentAssetMarketData, refresh, setAssetMarketData]);

  return useMemo(() => currentAssetMarketData, [currentAssetMarketData]);
};
