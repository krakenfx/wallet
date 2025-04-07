import { showToast } from '@/components/Toast';
import { Routes } from '@/Routes';
import type { Currency } from '@/screens/Settings/currency/types';
import type { ColorName } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import loc from '/loc';

export const fmt = {
  apy: (v: number, currency: Currency) => formatTokenAmount(String(v / 100), { currency }) + '%',
  tvl: (v: number, currency: Currency) => formatCurrency(String(v), { compact: true, currency }),
};

export const getColor = (v: number): ColorName => {
  return v >= 0 ? 'green400' : 'red400';
};

export enum SheetPosition {
  SMALL = 0,
  MEDIUM = 1,
  HIGH = 2,
}

export const refreshingVaultsEvent = 'refreshingVaults';

export const showRefreshingVaultsToast = async () =>
  showToast({
    type: 'info',
    text: loc._.updating,
    id: refreshingVaultsEvent,
    testID: 'RefreshingVaultsToast',
    dismissMode: 'event',
    iconLottieSource: require('@/assets/lottie/refreshSpinner.json'),
    whiteListRoutes: [Routes.DefiDetails],
  });
