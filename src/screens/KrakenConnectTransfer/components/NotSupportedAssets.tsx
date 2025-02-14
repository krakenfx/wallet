import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { KrakenAssetNotSupported } from '@/api/krakenConnect/types';
import { Label } from '@/components/Label';

import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { useTheme } from '@/theme/themes';

import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

interface Props {
  assets: KrakenAssetNotSupported[];
}

export const NotSupportedAssets = ({ assets }: Props) => {
  const { colors } = useTheme();
  const { currency } = useAppCurrency();
  const fiatRate = useCurrentUsdFiatRate();

  const notSupportedBalance = useMemo(() => {
    return assets.reduce((acc, curr) => {
      return acc + (curr.balanceInUsd ?? 0);
    }, 0);
  }, [assets]);
  const amountFormatted = useBalanceDisplay(formatCurrency(notSupportedBalance * fiatRate, { currency }), 7);

  return (
    <View style={[styles.container, { backgroundColor: colors.light2 }]}>
      <View style={styles.header}>
        <Label type="boldTitle2" color="light75">
          {loc.krakenConnect.transfer.unsupportedAssets}
        </Label>
        <Label type="boldLargeMonospace">~{amountFormatted}</Label>
      </View>

      <Label type="regularBody" color="light50">
        {loc.formatString(loc.krakenConnect.transfer.unsupportedAssetsDescription, { assets: assets.map(a => a.symbol).join(', ') })}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
});
