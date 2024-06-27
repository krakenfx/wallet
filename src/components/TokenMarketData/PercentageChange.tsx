import { defaults } from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { AssetMarketDataPercentageChange } from '@/realm/assetMarketData';
import { useAppCurrency } from '@/realm/settings';

import { getPercentageLabel } from './utils';

interface ItemProps {
  time: keyof AssetMarketDataPercentageChange;
  percentageChange: number | undefined;
  isFirst?: boolean;
  isLast?: boolean;
}

const parsePercentageKeyLabel = (key: keyof AssetMarketDataPercentageChange): string | undefined => {
  switch (key) {
    case 'hour':
      return '1H';
    case 'day':
      return '24H';
    case 'week':
      return '7D';
    case 'month':
      return '1M';
  }
};

const PercentageChangeItem = ({ time, percentageChange, isLast, isFirst }: ItemProps) => {
  const { currency } = useAppCurrency();
  const { label, color } = getPercentageLabel(percentageChange, currency);

  return (
    <View style={[styles.itemContainer, isFirst && styles.itemFirst, isLast && styles.itemLast]}>
      <GradientItemBackground />
      <Label type="regularCaption1" color="light75">
        {parsePercentageKeyLabel(time)}
      </Label>
      <Label type="boldCaption1" color={color}>
        {label}
      </Label>
    </View>
  );
};

interface Props {
  priceChangePercentage: AssetMarketDataPercentageChange;
}

const defaultPercentageChange: Partial<AssetMarketDataPercentageChange> = {
  week: undefined,
  day: undefined,
  hour: undefined,
  month: undefined,
};

export const PercentageChange = ({ priceChangePercentage }: Props) => {
  const priceChange = defaults(priceChangePercentage, defaultPercentageChange);
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <PercentageChangeItem key="hour" time="hour" percentageChange={priceChange.hour} isFirst />
      <PercentageChangeItem key="day" time="day" percentageChange={priceChange.day} />
      <PercentageChangeItem key="week" time="week" percentageChange={priceChange.week} />
      <PercentageChangeItem key="month" time="month" percentageChange={priceChange.month} isLast />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 1,
  },
  itemContainer: {
    height: 52,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemFirst: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  itemLast: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});
