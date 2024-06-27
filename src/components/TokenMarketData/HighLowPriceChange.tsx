import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { useAppCurrency } from '@/realm/settings';
import { PriceHistoryPeriod, TokenPrice, TokenPriceHighLow } from '@/realm/tokenPrice';
import { ColorName, useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

interface Props {
  highLow: TokenPriceHighLow;
  period: PriceHistoryPeriod;
  currentPrice?: TokenPrice;
  color: ColorName;
}

export const HighLowPriceChange = ({ highLow, currentPrice, color, period }: Props) => {
  const { currency } = useAppCurrency();
  const price = Number(currentPrice?.fiatValue[currency].value || 0);
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
      low: highLowPeriod?.low ?? 0,
      high: highLowPeriod?.high ?? 0,
    };
  }, [highLow, period]);

  const style = useAnimatedStyle(() => {
    const value = ((price - low) / (high - low || 1)) * 100;
    return {
      width: withTiming(`${value}%`),
      backgroundColor: withTiming(colors[color]),
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.lineArea, { backgroundColor: colors.purple_40 }]}>
        <Animated.View style={[styles.lineValue, style]} />
      </View>
      <View style={styles.rowWithLabels}>
        <View style={styles.priceLabel}>
          <Label type="regularCaption1" color="light75">
            {`${loc.marketData.low} `}
          </Label>
          <Label type="boldCaption1" color="light100">
            {formatCurrency(low, { currency, highPrecision: true })}
          </Label>
        </View>
        <View style={styles.priceLabel}>
          <Label type="regularCaption1" color="light75">
            {`${loc.marketData.high} `}
          </Label>
          <Label type="boldCaption1" color="light100">
            {formatCurrency(high, { currency, highPrecision: true })}
          </Label>
        </View>
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
  },
  lineArea: {
    height: 6,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  priceLabel: {
    flexDirection: 'row',
  },
  lineValue: {
    position: 'absolute',
    height: '100%',
    borderRadius: 12,
  },
});
