import { useCallback, useMemo, useRef } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useVaultMetricsQuery } from '@/reactQuery/hooks/useVaultMetricsQuery';
import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { type ColorName, useTheme } from '@/theme/themes';

import { fmt } from '../utils';

import { useDefiDetailsContext } from './DefiDetailsContext';

import loc from '/loc';

const CHART_METRICS: Record<number, 'apy' | 'tvl'> = {
  0: 'apy',
  1: 'tvl',
};

const GAP = 8;
type Props = { unset: boolean };

function getColor(v: number): ColorName {
  return v >= 0 ? 'green400' : 'red400';
}

export const DefiDetailsSwitch = ({ unset }: Props) => {
  const { currency } = useAppCurrency();
  const fiatRate = useCurrentUsdFiatRate();
  const { colors } = useTheme();
  const { period, chartMetric, setChartMetric } = useDefiDetailsContext();
  const containerWidth = useRef(0);
  const translateX = useSharedValue(0);
  const handlePress = useCallback(
    (cellIndex: number) => {
      if (!unset) {
        setChartMetric(CHART_METRICS[cellIndex] ?? 0);
        translateX.value = withTiming(cellIndex * (containerWidth.current / 2) ?? 0);
      }
    },
    [setChartMetric, translateX, unset],
  );
  const handle0 = useCallback(() => handlePress(0), [handlePress]);
  const handle1 = useCallback(() => handlePress(1), [handlePress]);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    containerWidth.current = width;
  }, []);

  const animatedstyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const { data } = useVaultMetricsQuery(period);

  const { apyColor, apyLabel, tvlColor, tvlLabel } = useMemo(() => {
    let apy = 0;
    let apyChange = 0;
    let tvl = 0;
    let tvlChange = 0;

    if (data) {
      const first = data[0];
      const last = data[data.length - 1];
      apy = last.apy;
      apyChange = last.apy - first.apy;
      tvl = fiatRate * last.tvl;
      tvlChange = fiatRate * last.tvl - fiatRate * first.tvl;
    }

    const apyColor = data && chartMetric === 'apy' ? getColor(apyChange) : 'light100';
    const apyLabel = data ? fmt.apy(apy * Math.sign(apyChange), currency) : '';
    const tvlColor = data && chartMetric === 'tvl' ? getColor(tvlChange) : 'light100';
    const tvlLabel = data ? fmt.tvl(tvl, currency) : '';

    return {
      apyColor,
      apyLabel,
      tvlColor,
      tvlLabel,
    };
  }, [chartMetric, currency, data, fiatRate]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Touchable onPress={handle0} style={[styles.cell, unset && { backgroundColor: colors.dark15 }]}>
        <Label type="boldCaption1" color="light50">
          {loc.earn.apy}
        </Label>
        <Label type="headerMarketDataPrice" color={apyColor} numberOfLines={1} adjustsFontSizeToFit>
          {apyLabel}
        </Label>
      </Touchable>
      <Touchable onPress={handle1} style={[styles.cell, unset && { backgroundColor: colors.dark15 }]}>
        <Label type="boldCaption1" color="light50">
          {loc.earn.tvl}
        </Label>
        <Label type="headerMarketDataPrice" color={tvlColor} numberOfLines={1} adjustsFontSizeToFit>
          {tvlLabel}
        </Label>
      </Touchable>
      {!unset && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            animatedstyle,
            styles.slider,
            {
              backgroundColor: colors.purple_20,
              width: containerWidth.current / 2 - GAP,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 10,
    gap: GAP,
  },
  cell: {
    flex: 1,
    width: '50%',
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  slider: {
    position: 'absolute',
    height: '100%',
    width: '50%',
    minWidth: '50%',
    borderRadius: 16,
  },
});
