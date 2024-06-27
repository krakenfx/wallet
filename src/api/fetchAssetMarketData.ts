import { getHarmony } from '@/api/base/apiFactory';
import { AssetMarketData } from '@/realm/assetMarketData';
import { Currency } from '@/screens/Settings/currency';

import { handleError } from '/helpers/errorHandler';

export async function fetchAssetMarketData(assetId: string, currency: Currency): Promise<AssetMarketData | undefined> {
  const harmony = await getHarmony();

  const response = await harmony
    .GET('/v1/tokenMarketData', {
      params: { query: { token: assetId, currency } },
    })
    .catch(err => {
      handleError(err, 'ERROR_CONTEXT_PLACEHOLDER');
      return null;
    });
  return response?.content ? { assetId, ...response.content } : undefined;
}
