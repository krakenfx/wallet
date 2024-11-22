import { defaults } from 'lodash';

import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';

import { Label } from '@/components/Label';
import type { AssetMarketDataPercentageChange } from '@/realm/assetMarketData';
import { useAppCurrency } from '@/realm/settings';

import { useTheme } from '@/theme/themes';
import { getPercentageLabel } from '@/utils/formatPercentage';

interface ItemProps {
  time: keyof AssetMarketDataPercentageChange;
  percentageChange: number | undefined;
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

  return undefined;
};

const PercentageChangeItem = ({ time, percentageChange }: ItemProps) => {
  const { currency } = useAppCurrency();
  const { label, color } = getPercentageLabel(percentageChange, 1, { currency, formatTokenAmount: true });

  return (
    <View style={styles.itemContainer}>
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

const Separator = () => {
  const { colors } = useTheme();
  return <View style={[styles.bar, { backgroundColor: colors.background }]} />;
};

export const PercentageChange = ({ priceChangePercentage }: Props) => {
  const priceChange = defaults(priceChangePercentage, defaultPercentageChange);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <GradientItemBackground />
      <PercentageChangeItem key="hour" time="hour" percentageChange={priceChange.hour} />
      <Separator />
      <PercentageChangeItem key="day" time="day" percentageChange={priceChange.day} />
      <Separator />
      <PercentageChangeItem key="week" time="week" percentageChange={priceChange.week} />
      <Separator />
      <PercentageChangeItem key="month" time="month" percentageChange={priceChange.month} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    overflow: 'hidden',
    gap: 1,
  },
  bar: {
    width: 1,
    opacity: 0.4,
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
});
