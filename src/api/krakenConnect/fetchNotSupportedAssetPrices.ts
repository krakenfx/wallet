import type { KrakenAssetNotSupported, KrakenTickerDict } from '@/api/krakenConnect/types';

import { fetchKrakenPublicApi } from './base/fetchKrakenPublicApi';

export const fetchNotSupportedAssetPrices = async (asset: KrakenAssetNotSupported) => {
  const params = `?pair=${asset.symbol}USD`;
  const { result, error } = await fetchKrakenPublicApi<KrakenTickerDict>({
    path: '/0/public/Ticker',
    params,
  });
  if (error) {
    return null;
  }

  if (result) {
    const keys = Object.keys(result);
    if (keys.length > 0 && 'b' in result[keys[0]]) {
      return result[keys[0]].b[0];
    }
    return null;
  }

  return null;
};
