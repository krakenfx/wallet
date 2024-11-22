import type { FiatValue, TokenPrice } from '@/realm/tokenPrice';
import { Currency } from '@/screens/Settings/currency/types';

import { getHarmony } from './base/apiFactory';

const getEmptyResponse = (assetId: string) => {
  const fiatValue: TokenPrice['fiatValue'] = {};

  Object.values(Currency).forEach(currency => {
    fiatValue[currency] = { value: '0', source: 'none' } as FiatValue;
  });

  return {
    assetId,
    fiatValue,
  };
};

export async function fetchPriceForToken(assetId: string): Promise<TokenPrice> {
  const harmony = await getHarmony();
  const { content } = await harmony.GET('/v2/price', { params: { query: { token: assetId } } });

  if (!content) {
    return getEmptyResponse(assetId);
  }

  return content;
}
