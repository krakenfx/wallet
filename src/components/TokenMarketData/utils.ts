import { StyleSheet } from 'react-native';

import { TokenPriceHighLow, TokenPriceHighLowItem, TokenPriceHistoryItem } from '@/realm/tokenPrice';
import { Currency } from '@/screens/Settings/currency';
import { Theme } from '@/theme/themes';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

export const getPercentageLabel = (value: number | null | undefined, currency: Currency) => {
  const label: string =
    typeof value === 'number' ? (typeof value === 'number' ? `${value > 0 ? '+' : ''}${formatTokenAmount(value.toFixed(1), { currency })}%` : '-') : '';
  let color: keyof Theme['colors'] = 'light75';

  if (typeof value === 'number') {
    color = value < 0 ? 'red400' : 'green400';
  }

  return { label, color };
};

export const commonStyles = StyleSheet.create({
  infoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 12,
    flex: 1,
  },
  small: {
    height: 55,
    paddingRight: 16,
  },
  medium: {
    height: 90,
    paddingRight: 16,
  },
});

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
