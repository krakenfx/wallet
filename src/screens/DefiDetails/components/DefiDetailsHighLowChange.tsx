import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { useAppCurrency } from '@/realm/settings';
import type { PriceHistoryPeriod, TokenPrice, TokenPriceHighLow } from '@/realm/tokenPrice';
import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  highLow: TokenPriceHighLow;
  period: PriceHistoryPeriod;
  currentValue?: TokenPrice;
  color: ColorName;
}

export const DefiDetailsHighLowChange = ({ highLow, currentValue, color, period }: Props) => {
  const { currency } = useAppCurrency();
  const currentValue_ = Number(currentValue?.fiatValue[currency].value || 0);
  const { colors } = useTheme();

  const mapPeriodToKey = (timePeriod: PriceHistoryPeriod): keyof TokenPriceHighLow => {
    switch (timePeriod) {
      case 'WEEK':
        return 'week';
      case 'MONTH':
        return 'month';
      case 'YEAR':
        return 'year';
      case 'ALL':
        return 'all';
    }
    return 'day';
  };

  const { high, low } = useMemo(() => {
    const highLowPeriod = highLow[mapPeriodToKey(period)];
    return {
      low: highLowPeriod?.low ?? 10,
      high: highLowPeriod?.high ?? 10,
    };
  }, [highLow, period]);

  const style = useAnimatedStyle(() => {
    const value = ((currentValue_ - low) / (high - low || 1)) * 100;
    return {
      width: withTiming(`${value}%`),
      backgroundColor: withTiming(colors[color]),
    };
  });

  const hasLowHighValues = !!low && !!high;

  return (
    <View style={styles.container} testID="HighLowPriceChange">
      <View style={[styles.lineArea, { backgroundColor: colors.purple_40 }]}>
        <Animated.View style={[styles.lineValue, style]} />
      </View>
      <View style={styles.rowWithLabels}>
        {hasLowHighValues && (
          <>
            <View style={styles.label}>
              <Label type="regularCaption1" color="light75">
                {`${loc.earn.detailsSheet.low} `}
              </Label>
              <Label type="boldCaption1" color="light100">
                {low + '%'}
              </Label>
            </View>
            <View style={styles.label}>
              <Label type="regularCaption1" color="light75">
                {`${loc.earn.detailsSheet.high} `}
              </Label>
              <Label type="boldCaption1" color="light100">
                {high + '%'}
              </Label>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  rowWithLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 17,
  },
  lineArea: {
    height: 6,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  label: {
    flexDirection: 'row',
  },
  lineValue: {
    position: 'absolute',
    height: '100%',
    borderRadius: 12,
  },
});
