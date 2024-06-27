import { PriceHistoryPeriod } from './schema';

export const getPriceHistoryId = (assetId: string, period: PriceHistoryPeriod) => `${assetId}:${period}`;
