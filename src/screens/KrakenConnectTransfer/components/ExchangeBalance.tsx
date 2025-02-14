import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { KrakenIcon } from '@/components/KrakenIcon';
import { Label } from '@/components/Label';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { useKrakenConnectBalance } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectBalance';
import { useAppCurrency } from '@/realm/settings';

import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

const UPDATE_BALANCE_DEBOUNCE = 2000;

export const ExchangeBalance = () => {
  const { data } = useKrakenConnectBalance();

  const [totalBalance, setTotalBalance] = useState<number>(0);

  const { currency } = useAppCurrency();
  const balanceFormatted = useBalanceDisplay(formatCurrency(totalBalance || 0, { currency }));
  const { colors } = useTheme();

  const previousBalanceRef = useRef<number>(totalBalance);

  useDebounceEffect(
    () => {
      setTotalBalance(data || previousBalanceRef.current);
      if (data) {
        previousBalanceRef.current = data;
      }
    },
    [data],
    UPDATE_BALANCE_DEBOUNCE,
    { leading: true },
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.light2 }]}>
      <View style={styles.label}>
        <KrakenIcon size={19} />
        <Label type="boldTitle2" color="light75">
          {loc.krakenConnect.exchangeBalance}
        </Label>
      </View>

      <View style={styles.balanceValueContainer}>
        <AnimatedNumbers style={styles.animatedNumbers} color="light75" value={balanceFormatted} type="boldLargeMonospace" fontSize={15} glyphSize={14} />
      </View>
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
  balanceValueContainer: { position: 'relative', flexGrow: 1 },
  animatedNumbers: { alignSelf: 'flex-end' },
});
