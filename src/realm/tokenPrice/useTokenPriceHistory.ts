import { useEffect } from 'react';

import { fetchTokenPriceHistory } from '@/api/fetchTokenPriceHistory';
import { useObject } from '@/realm/RealmContext';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPriceHistoryMutations } from '@/realm/tokenPrice';
import type { PriceHistoryPeriod, RealmTokenPriceHistory } from '@/realm/tokenPrice/schema';
import { REALM_TYPE_TOKEN_PRICE_HISTORY } from '@/realm/tokenPrice/schema';
import { getPriceHistoryId } from '@/realm/tokenPrice/utils';

export const useTokenPriceHistory = (assetId: string, period: PriceHistoryPeriod) => {
  const tokenPriceHistory = useObject<RealmTokenPriceHistory>(REALM_TYPE_TOKEN_PRICE_HISTORY, getPriceHistoryId(assetId, period), 'priceHistoryId');
  const { setTokenPriceHistory } = useTokenPriceHistoryMutations();
  const { currency } = useAppCurrency();

  useEffect(() => {
    const fetch = async () => {
      const priceHistoryResponse = await fetchTokenPriceHistory(assetId, period, currency);
      if (priceHistoryResponse) {
        setTokenPriceHistory(priceHistoryResponse);
      }
    };
    fetch();
  }, [assetId, currency, period, setTokenPriceHistory]);

  return tokenPriceHistory;
};
