import type { TokenPriceHighLow, TokenPriceHighLowItem, TokenPriceHistoryItem } from '@/realm/tokenPrice';
import type { Theme } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

export const useColorByCategory = (category: string, value: number) => {
  const { colors } = useTheme();
  const isDebt = category === 'borrow' || value < 0;
  const isReward = category === 'claimable';
  const color: keyof Theme['colors'] | undefined = isDebt ? 'yellow500' : isReward ? 'green400' : undefined;
  const backgroundColor = isDebt ? colors.yellow500_15 : isReward ? colors.green400_15 : undefined;

  return {
    color,
    backgroundColor,
    isDebt,
    isReward,
  };
};

export enum SheetPosition {
  SMALL = 0,
  MEDIUM = 1,
  HIGH = 2,
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

const generateChartPlaceholder = (): TokenPriceHistoryItem[] => {
  const placeholder = [];
  const numPoints = 100;
  for (let i = 0; i < numPoints; i++) {
    const timestamp = i + 1;
    const value = 1.5 * Math.sin((2.5 * Math.PI * i) / (numPoints - 1));
    placeholder.push({ timestamp, value });
  }
  return placeholder;
};
export const CHART_PLACEHOLDER: TokenPriceHistoryItem[] = generateChartPlaceholder();
