import { showToast } from '@/components/Toast';
import { Routes } from '@/Routes';
import type { Currency } from '@/screens/Settings/currency/types';
import type { Theme } from '@/theme/themes';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import loc from '/loc';

export const fmt = {
  apy: (v: number, currency: Currency) => formatTokenAmount(String(v / 100), { currency }) + '%',
  tvl: (v: number, currency: Currency) => formatCurrency(String(v), { compact: true, currency }),
};

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

const generateChartPlaceholder = (): {
  timestamp: number;
  value: number;
}[] => {
  const placeholder = [];
  const numPoints = 100;
  for (let i = 0; i < numPoints; i++) {
    const timestamp = i + 1;
    const value = 1.5 * Math.sin((2.5 * Math.PI * i) / (numPoints - 1));
    placeholder.push({ timestamp, value });
  }
  return placeholder;
};
export const CHART_PLACEHOLDER: {
  timestamp: number;
  value: number;
}[] = generateChartPlaceholder();

export const refreshingVaultsEvent = 'refreshingVaults';

export const showRefreshingVaultsToast = async () =>
  showToast({
    type: 'info',
    text: loc._.updating,
    id: refreshingVaultsEvent,
    testID: 'RefreshingVaultsToast',
    dismissMode: 'event',
    iconLottieSource: require('@/assets/lottie/refreshSpinner.json'),
    whiteListRoutes: [Routes.DefiDetailsV2],
  });
