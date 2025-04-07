import type { TokenPriceHighLow, TokenPriceHighLowItem, TokenPriceHistoryItem } from '@/realm/tokenPrice';
import { generateChartPlaceholder } from '@/utils/generateChartPlaceholder';

export enum SheetPosition {
  'SMALL' = 0,
  'MEDIUM' = 1,
  'HIGH' = 2,
}

export const PRICE_PLACEHOLDER = '-.--';

export const CHART_DATA_ITEMS_COUNT = 100;

const defaultHighLowItem: TokenPriceHighLowItem = {
  low: 0,
  high: 0,
};

export const HIGH_LOW_PRICE_PLACEHOLDER: TokenPriceHighLow = {
  day: defaultHighLowItem,
  week: defaultHighLowItem,
  month: defaultHighLowItem,
  year: defaultHighLowItem,
  all: defaultHighLowItem,
};

export const CHART_PLACEHOLDER: TokenPriceHistoryItem[] = generateChartPlaceholder(CHART_DATA_ITEMS_COUNT);
