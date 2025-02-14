import { useMemo } from 'react';

import { HighLowChange } from '@/components/HighLowChange';
import { useAppCurrency } from '@/realm/settings';
import type { PriceHistoryPeriod, TokenPrice, TokenPriceHighLow } from '@/realm/tokenPrice';

import type { ColorName } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

const mapPeriodToKey: Record<string, keyof TokenPriceHighLow> = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: 'all',
  DAY: 'day',
};

interface Props {
  highLow: TokenPriceHighLow;
  period: PriceHistoryPeriod;
  currentPrice?: TokenPrice;
  color: ColorName;
}

export const HighLowPriceChange = ({ currentPrice, color, highLow, period }: Props) => {
  const { currency } = useAppCurrency();
  const price = Number(currentPrice?.fiatValue[currency].value || 0);

  const { high, low } = useMemo(() => {
    const highLowPeriod = highLow[mapPeriodToKey[period] || 'day'];
    return {
      low: highLowPeriod?.low ?? 0,
      high: highLowPeriod?.high ?? 0,
    };
  }, [highLow, period]);
  const highLabel = formatCurrency(high, { currency, findFirstNonZeroDigits: true });
  const lowLabel = formatCurrency(low, { currency, findFirstNonZeroDigits: true });

  return <HighLowChange color={color} currentValue={price} high={high} highLabel={highLabel} low={low} lowLabel={lowLabel} />;
};
