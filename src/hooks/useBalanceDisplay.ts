import { useIsHideBalancesEnabled } from '@/realm/settings/useIsHideBalancesEnabled';

export const useBalanceDisplay = (value: string | undefined | LocalizedString, count: number = 5): string => {
  if (useIsHideBalancesEnabled()) {
    return new Array(count + 1).join('*');
  }
  return value as string;
};
