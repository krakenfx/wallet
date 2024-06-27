import { CHART_DATA_ITEMS_COUNT } from '@/components/TokenMarketData/utils';
import { PriceHistoryPeriod, TokenPriceHistory } from '@/realm/tokenPrice';
import { getPriceHistoryId } from '@/realm/tokenPrice/utils';
import { Currency } from '@/screens/Settings/currency';
import { interpolateChartData } from '@/utils/interpolateChartData';

import { getHarmony } from './base/apiFactory';

export async function fetchTokenPriceHistory(assetId: string, period: PriceHistoryPeriod, currency: Currency): Promise<TokenPriceHistory> {
  const harmony = await getHarmony();
  const { content } = await harmony.GET('/v1/priceHistory', { params: { query: { token: assetId, granularity: period, currency } } });

  const interpolatedData = content ? interpolateChartData(content.prices, CHART_DATA_ITEMS_COUNT) : [];
  const highLow = content ? content.highLow : undefined;

  return {
    assetId,
    prices: interpolatedData,
    priceHistoryId: getPriceHistoryId(assetId, period),
    updatedAt: new Date(),
    highLow,
    period,
  };
}
