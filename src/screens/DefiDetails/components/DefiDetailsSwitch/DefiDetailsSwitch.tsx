import { useCallback, useMemo, useRef } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useVaultHistoricalMetricsQuery } from '@/reactQuery/hooks/earn/useVaultHistoricalMetricsQuery';
import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';

import { fmt, getColor } from '../../utils';

import { useDefiDetailsContext } from '../DefiDetailsContext';

import { DefiDetailsSwitchBase } from './DefiDetailsSwitchBase';

const CHART_METRICS: Record<number, 'apy' | 'tvl'> = {
  0: 'apy',
  1: 'tvl',
};

type Props = { unset: boolean };

export const DefiDetailsSwitch = ({ unset }: Props) => {
  const { currency } = useAppCurrency();
  const fiatRate = useCurrentUsdFiatRate();
  const { vaultAddress, vaultNetwork, period, chartMetric, setChartMetric } = useDefiDetailsContext();
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

  const { data } = useVaultHistoricalMetricsQuery(vaultAddress, vaultNetwork, period);

  const { apyColor, apyLabel, tvlColor, tvlLabel } = useMemo(() => {
    let apy = 0;
    let apyChange = 0;
    let tvl = 0;
    let tvlChange = 0;

    if (data && data.length) {
      const first = data[0];
      const last = data[data.length - 1];
      apy = last.apy;
      apyChange = last.apy - first.apy;
      tvl = fiatRate * last.tvl;
      tvlChange = fiatRate * last.tvl - fiatRate * first.tvl;
    }

    const apyColor = data && chartMetric === 'apy' ? getColor(apyChange) : 'light100';
    const apyLabel = data ? fmt.apy(apy, currency) : '';
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
    <DefiDetailsSwitchBase
      unset={unset}
      animatedstyle={animatedstyle}
      containerWidth={containerWidth}
      onLayout={onLayout}
      handle0={handle0}
      handle1={handle1}
      apy={apyLabel}
      apyColor={apyColor}
      tvl={tvlLabel}
      tvlColor={tvlColor}
    />
  );
};
