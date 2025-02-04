import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useKrakenConnectBalance } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectBalance';
import { useAppCurrency } from '@/realm/settings';
import { KrakenIcon } from '@/screens/Home/components/assets/KrakenIcon';

import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

export const ExchangeBalance = () => {
  const { data } = useKrakenConnectBalance();
  const { currency } = useAppCurrency();
  const balanceFormatted = useBalanceDisplay(formatCurrency(data || 0, { currency }));
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.light2 }]}>
      <View style={styles.label}>
        <KrakenIcon size={19} />
        <Label type="boldTitle2" color="light75">
          {loc.krakenConnect.exchangeBalance}
        </Label>
      </View>

      <Label color="light75" type="boldLargeMonospace">
        {balanceFormatted}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 16,
    overflow: 'hidden',
    flexBasis: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
