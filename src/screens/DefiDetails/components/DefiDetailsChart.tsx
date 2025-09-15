import { LinearGradient, vec } from '@shopify/react-native-skia';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { CurvedTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { CartesianChart, Line } from 'victory-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Button } from '@/components/Button';
import { HighLowChange } from '@/components/HighLowChange';
import { PeriodSwitcher } from '@/components/PeriodSwitcher';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { TARGET_DATASET_LENGTH, useVaultHistoricalMetricsQuery } from '@/reactQuery/hooks/earn/useVaultHistoricalMetricsQuery';
import { useAppCurrency } from '@/realm/settings';
import type { PriceHistoryPeriod } from '@/realm/tokenPrice';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { type ColorName, useTheme } from '@/theme/themes';
import { generateChartPlaceholder } from '@/utils/generateChartPlaceholder';

import { fmt } from '../utils';

import { useDefiDetailsContext } from './DefiDetailsContext';

import loc from '/loc';

type ChartColorSet = { highLow: ColorName; gradient: string[] };
const RED_GRADIENT = ['#8D52FF', '#8D52FF', '#EC6D6D'];
const GREEN_GRADIENT = ['#3D3D95', '#8D52FF', '#62DD93'];
const ASCENDING_COLOR_SET: ChartColorSet = { highLow: 'green400', gradient: GREEN_GRADIENT };
const DESCENDING_COLOR_SET: ChartColorSet = { highLow: 'red400', gradient: RED_GRADIENT };

const CHART_PLACEHOLDER = generateChartPlaceholder(TARGET_DATASET_LENGTH);
const STANDARD_DEVICE_HEIGHT_FOR_CHART = 850;
const DEFAULT_CHART_HEIGHT = 120;
const CHART_DOMAIN_PADDING = { top: 12, bottom: 12 };

const LINE_ANIMATION = { type: 'timing' as const, duration: 500 };
const START_POINT = vec(0, 0);
const END_POINT = vec(400, 0);

type Props = {
  hide?: boolean;
};

export const DefiDetailsChart = ({ hide }: Props) => {
  const { vaultAddress, vaultNetwork, chartMetric, period, setPeriod } = useDefiDetailsContext();
  const { currency } = useAppCurrency();
  const fiatRate = useCurrentUsdFiatRate();

  const { data, isPending, isError, refetch, isRefetching } = useVaultHistoricalMetricsQuery(vaultAddress, vaultNetwork, period);
  const refreshChart = () => refetch();
  const isPendingOrRefetching = isPending || isRefetching;

  const dataPoints = useMemo(
    () =>
      (data || []).map(d => {
        return {
          timestamp: d.timestamp,
          value: chartMetric === 'apy' ? d.apy : fiatRate * d.tvl,
        };
      }),
    [data, chartMetric, fiatRate],
  );
  const dataLength = dataPoints.length;
  const hasData = Boolean(dataLength);
  const showRefreshChartButton = ((isError && !hasData) || !hasData) && !isPendingOrRefetching;
  const [first, last] = useMemo(
    () => (hasData ? [dataPoints[0], dataPoints[dataLength - 1]] : [{ value: 0 }, { value: 0 }]),
    [hasData, dataLength, dataPoints],
  );
  const { high, low } = useMemo(
    () => (hasData ? { low: Math.min(...dataPoints.map(({ value }) => value)), high: Math.max(...dataPoints.map(({ value }) => value)) } : { low: 0, high: 0 }),
    [hasData, dataPoints],
  );
  const currentValue = useMemo(() => (hasData ? last.value : 0), [hasData, last]);
  const chartData = useMemo(() => (hide ? [] : hasData ? dataPoints : CHART_PLACEHOLDER), [hide, hasData, dataPoints]);

  const { height, size: deviceSize } = useDeviceSize();
  const chartHeight = useMemo(() => {
    const diff = height - STANDARD_DEVICE_HEIGHT_FOR_CHART;
    const chartHeightOffset = diff > 0 ? diff : 0;
    return deviceSize === 'small' ? 100 : DEFAULT_CHART_HEIGHT + chartHeightOffset;
  }, [height, deviceSize]);

  const valueChange = last.value - first.value;
  const { colors } = useTheme();
  const chartColors: ChartColorSet = useMemo(() => {
    if (!hasData || isPending) {
      return { highLow: 'transparent', gradient: [colors.purple_40, colors.purple_40] };
    }

    return valueChange >= 0 ? ASCENDING_COLOR_SET : DESCENDING_COLOR_SET;
  }, [hasData, colors, isPending, valueChange]);

  const onChangePeriod = useCallback(
    (value: PriceHistoryPeriod) => {
      setPeriod(value);
    },
    [setPeriod],
  );

  const containerStyle = deviceSize === 'small' ? styles.smallDeviceContainer : styles.container;
  const lineColor = hasData ? colors.kraken : colors.purple_40;
  const highLabel = fmt[chartMetric](high, currency);
  const lowLabel = fmt[chartMetric](low, currency);

  return (
    <View style={containerStyle} testID="DefiDetailsChartArea">
      <Animated.View style={[styles.chart, { height: chartHeight }]} layout={CurvedTransition} entering={FadeIn} exiting={FadeOut}>
        <CartesianChart data={chartData} xKey="timestamp" yKeys={['value']} domainPadding={CHART_DOMAIN_PADDING}>
          {({ points }) => (
            <Line connectMissingData curveType="natural" points={points.value} color={lineColor} strokeWidth={3} animate={LINE_ANIMATION}>
              <LinearGradient start={START_POINT} end={END_POINT} colors={chartColors.gradient} />
            </Line>
          )}
        </CartesianChart>
        {isPendingOrRefetching && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.pending}>
            <ActivityIndicator />
          </Animated.View>
        )}
        {showRefreshChartButton && (
          <View style={styles.refreshChartButtonContainer}>
            <Button text={loc.earn.detailsSheet.refreshChart} style={styles.refreshChartButton} onPress={refreshChart} />
          </View>
        )}
      </Animated.View>
      <PeriodSwitcher onChange={onChangePeriod} disabled={!isError && !hasData} preselectedIndex={1} hideYearAndAll />
      <View style={styles.highLowChange}>
        <HighLowChange color={chartColors.highLow} high={high} low={low} currentValue={currentValue} highLabel={highLabel} lowLabel={lowLabel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 40,
  },
  smallDeviceContainer: {
    marginTop: 0,
  },
  chart: {
    marginLeft: -16,
  },
  highLowChange: {
    marginTop: 12,
  },
  refreshChartButtonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: DEFAULT_CHART_HEIGHT / 2,
  },
  refreshChartButton: {
    marginHorizontal: 'auto',
  },
});
