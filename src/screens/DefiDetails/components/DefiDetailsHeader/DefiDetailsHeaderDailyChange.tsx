import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useVaultHistoricalMetricsQuery } from '@/reactQuery/hooks/earn/useVaultHistoricalMetricsQuery';
import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { formatCurrency } from '@/utils/formatCurrency';

import { getColor } from '../../utils';

import { useDefiDetailsContext } from '../DefiDetailsContext';

export const DefiDetailsHeaderDailyChange = ({ balanceUsd }: { balanceUsd: number }) => {
  const { currency, currencyInfo } = useAppCurrency();
  const { vaultAddress, vaultNetwork } = useDefiDetailsContext();
  const { data } = useVaultHistoricalMetricsQuery(vaultAddress, vaultNetwork, 'DAY');
  const dailyApyChange = useMemo(() => {
    let dailyApyChange = 0;

    if (data && data.length) {
      const first = data[0];
      const last = data[data.length - 1];

      dailyApyChange = last.apy - first.apy;
    }

    return dailyApyChange;
  }, [data]);

  const usdFiatRate = useCurrentUsdFiatRate();
  const balanceInAppCurrency = usdFiatRate * balanceUsd;

  const dailyApyChangeFormatted = `(${dailyApyChange / 100}%)`;
  const dailyChangeInAppCurrency = calculateDailyChange(balanceInAppCurrency, dailyApyChange);
  const dailyChangeInAppCurrencyFormatted = `${dailyApyChange >= 0 ? '+' : ''}${formatCurrency(dailyChangeInAppCurrency, { currency, hideCurrencySign: true })} ${currencyInfo.symbol}`;
  const dailyChangeFormatted = useBalanceDisplay(dailyChangeInAppCurrencyFormatted + ' ' + dailyApyChangeFormatted, 7);
  const color = useMemo(() => getColor(dailyApyChange), [dailyApyChange]);

  return (
    <View style={styles.container}>
      <Label type="regularBody" color={color}>
        {dailyChangeFormatted}
      </Label>
    </View>
  );
};

function calculateDailyChange(balance: number, dailyApyChange: number): number {
  return balance * (dailyApyChange / 10000);
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
});
