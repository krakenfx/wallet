import { Currency } from '@/screens/Settings/currency';
import { Theme } from '@/theme/themes';

import { formatTokenAmount } from './formatTokenAmount';

export const getPercentageLabel = (
  value: number | null | undefined,
  decimals: number,
  options?: {
    currency?: Currency;
    placeholderColor?: keyof Theme['colors'];
    formatTokenAmount?: boolean;
    placeholder?: string;
    truncateTrailingZeros?: boolean;
  },
) => {
  let color: keyof Theme['colors'] = options?.placeholderColor ?? 'light75';
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return {
      label: options?.placeholder ?? '',
      color,
    };
  }

  const prefix = `${value > 0 ? '+' : ''}`;
  const valueString = options?.truncateTrailingZeros ? value.toFixed(decimals) : `${Number(value.toFixed(decimals))}`;

  let label: string;
  if (options?.formatTokenAmount && options?.currency) {
    label = `${prefix}${formatTokenAmount(valueString, { currency: options?.currency })}%`;
  } else {
    label = `${prefix}${valueString}%`;
  }

  color = value < 0 ? 'red400' : 'green400';

  return { label, color };
};
