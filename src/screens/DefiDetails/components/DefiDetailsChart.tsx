import { LinearGradient, vec } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { CurvedTransition } from 'react-native-reanimated';
import { CartesianChart, Line } from 'victory-native';

import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useAppCurrency } from '@/realm/settings';
import type { PriceHistoryPeriod, TokenPriceHighLow, TokenPriceHistoryItem } from '@/realm/tokenPrice';
import { useTokenById } from '@/realm/tokens';
import { useTheme } from '@/theme/themes';

import { getPercentageLabel } from '@/utils/formatPercentage';

import { CHART_PLACEHOLDER, HIGH_LOW_PRICE_PLACEHOLDER } from '../utils';

import { useDefiDetailsContext } from './DefiDetailsContext';
import { DefiDetailsHighLowChange } from './DefiDetailsHighLowChange';
import { DefiDetailsPeriodSwitcher } from './DefiDetailsPeriodSwitcher';

const RED_GRADIENT = ['#8D52FF', '#8D52FF', '#EC6D6D'];
const GREEN_GRADIENT = ['#3D3D95', '#8D52FF', '#62DD93'];

const STANDARD_DEVICE_HEIGHT_FOR_CHART = 850;
const DEFAULT_CHART_HEIGHT = 120;

export const DefiDetailsChart = () => {
  const hasData = false;
  const { assetCaipId } = useDefiDetailsContext();
  const [period, setPeriod] = useState<PriceHistoryPeriod>('DAY');
  const [chartData] = useState<TokenPriceHistoryItem[]>(CHART_PLACEHOLDER);
  const [highLowData] = useState<TokenPriceHighLow>(HIGH_LOW_PRICE_PLACEHOLDER);
  const [dataInitialised] = useState(false);
  const token = useTokenById(assetCaipId);
  const { currency } = useAppCurrency();

  const { height, size: deviceSize } = useDeviceSize();
  const chartHeight = useMemo(() => {
    const diff = height - STANDARD_DEVICE_HEIGHT_FOR_CHART;
    const chartHeightOffset = diff > 0 ? diff : 0;
    return deviceSize === 'small' ? 100 : DEFAULT_CHART_HEIGHT + chartHeightOffset;
  }, [height, deviceSize]);

  const getPriceChange = (timePeriod: PriceHistoryPeriod) => {
    switch (timePeriod) {
      case 'DAY':
        return token?.marketData?.priceChangePercentage.day;
      case 'WEEK':
        return token?.marketData?.priceChangePercentage.week;
      case 'MONTH':
        return token?.marketData?.priceChangePercentage.month;
      case 'YEAR':
        return token?.marketData?.priceChangePercentage.year;
      case 'ALL':
        return token?.marketData?.priceChangePercentage.all;
      default:
        return token?.marketData?.priceChangePercentage.day;
    }
  };

  const priceChange = getPriceChange(period);
  const { color } = getPercentageLabel(getPriceChange(period), 1, { currency, formatTokenAmount: true });

  const { colors } = useTheme();

  const chartColor = !dataInitialised ? [colors.purple_40] : priceChange !== undefined && priceChange >= 0 ? GREEN_GRADIENT : RED_GRADIENT;

  const onChangePeriod = (value: PriceHistoryPeriod) => {
    setPeriod(value);
  };

  const style = deviceSize === 'small' ? styles.smallDeviceContainer : styles.container;

  return (
    <View style={style} testID="DefiDetailsChartArea">
      <>
        <Animated.View style={[styles.chart, { height: chartHeight }]} layout={CurvedTransition}>
          <CartesianChart data={chartData} xKey="timestamp" yKeys={['value']}>
            {({ points }) => (
              <Line
                connectMissingData
                curveType="natural"
                points={points.value}
                color={dataInitialised ? colors.kraken : colors.purple_40}
                strokeWidth={3}
                animate={{ type: 'timing', duration: 500 }}>
                <LinearGradient start={vec(0, 0)} end={vec(400, 0)} colors={chartColor} />
              </Line>
            )}
          </CartesianChart>
        </Animated.View>
        <DefiDetailsPeriodSwitcher onChange={onChangePeriod} disabled={!hasData} />
        <DefiDetailsHighLowChange color={dataInitialised ? color : 'transparent'} highLow={highLowData} period={period} currentValue={token?.price} />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  smallDeviceContainer: {
    marginTop: 0,
  },
  chart: {
    marginLeft: -16,
  },
});
