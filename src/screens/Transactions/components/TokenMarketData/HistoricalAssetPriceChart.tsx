import { LinearGradient, vec } from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { CurvedTransition } from 'react-native-reanimated';
import { CartesianChart, Line } from 'victory-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { Label, Typography } from '@/components/Label';
import { ScalableLabel } from '@/components/ScalableLabel';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useAppCurrency } from '@/realm/settings';
import type { PriceHistoryPeriod, RealmTokenPriceHighLow, RealmTokenPriceHistoryItem, TokenPriceHighLow, TokenPriceHistoryItem } from '@/realm/tokenPrice';
import { useTokenPriceHistory } from '@/realm/tokenPrice';
import { useTokenById } from '@/realm/tokens';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import { getPercentageLabel } from '@/utils/formatPercentage';

import { HighLowPriceChange } from './HighLowPriceChange';
import { PeriodSwitcher } from './PeriodSwitcher';
import { CHART_PLACEHOLDER, HIGH_LOW_PRICE_PLACEHOLDER, PRICE_PLACEHOLDER, SheetPosition } from './utils';

import loc from '/loc';

interface Props {
  assetId: string;
  tokenId: string;
  price?: number;
  size: SheetPosition;
}

const RED_GRADIENT = ['#8D52FF', '#8D52FF', '#EC6D6D'];
const GREEN_GRADIENT = ['#3D3D95', '#8D52FF', '#62DD93'];

const convertRealmArrayToChartData = (prices: Realm.List<RealmTokenPriceHistoryItem>): TokenPriceHistoryItem[] => {
  return prices.toJSON() as TokenPriceHistoryItem[];
};

const STANDARD_DEVICE_HEIGHT_FOR_CHART = 850;
const DEFAULT_CHART_HEIGHT = 120;

export const HistoricalAssetPriceChart = ({ assetId, tokenId, size, price }: Props) => {
  const [period, setPeriod] = useState<PriceHistoryPeriod>('DAY');
  const data = useTokenPriceHistory(assetId, period);
  const [chartData, setChartData] = useState<TokenPriceHistoryItem[]>(CHART_PLACEHOLDER);
  const [highLowData, setHighLowData] = useState<TokenPriceHighLow>(HIGH_LOW_PRICE_PLACEHOLDER);
  const [dataInitialised, setDataInitialised] = useState(false);
  const token = useTokenById(tokenId);
  const { currency } = useAppCurrency();
  const priceNotAvailable = !price;

  const { height, size: deviceSize } = useDeviceSize();
  const chartHeight = useMemo(() => {
    const diff = height - STANDARD_DEVICE_HEIGHT_FOR_CHART;
    const chartHeightOffset = diff > 0 ? diff : 0;
    return deviceSize === 'small' ? 100 : DEFAULT_CHART_HEIGHT + chartHeightOffset;
  }, [height, deviceSize]);

  useEffect(() => {
    if (data) {
      const prices = convertRealmArrayToChartData(data.prices);
      if (prices && prices.length > 0) {
        setChartData(prices);
        setDataInitialised(true);
      }
    }
  }, [data, period]);

  useEffect(() => {
    if (data && data.highLow && !dataInitialised) {
      
      
      setHighLowData((data.highLow as RealmTokenPriceHighLow).toJSON());
    }
  }, [data, dataInitialised]);

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
  const { label: percentageLabel, color } = getPercentageLabel(getPriceChange(period), 1, { currency, formatTokenAmount: true });
  const priceLabel = priceNotAvailable || !price ? PRICE_PLACEHOLDER : formatCurrency(price, { currency, findFirstNonZeroDigits: true });

  const { colors } = useTheme();

  const chartColor = !dataInitialised ? [colors.purple_40] : priceChange !== undefined && priceChange >= 0 ? GREEN_GRADIENT : RED_GRADIENT;

  const onChangePeriod = (value: PriceHistoryPeriod) => {
    setPeriod(value);
  };

  const isHigh = size === SheetPosition.HIGH;
  const style = deviceSize === 'small' ? styles.smallDeviceContainer : styles.container;

  return (
    <View style={style} testID="AssetPriceChartArea">
      <Label type="boldCaption2" color="light50">
        {priceNotAvailable ? loc.marketData.priceNotAvailable : loc.marketData.price}
      </Label>
      <View style={isHigh ? styles.column : styles.row}>
        <ScalableLabel
          testID="PriceLabel"
          scale={isHigh ? 1.5 : 1}
          style={[isHigh && styles.pricePosHigh]}
          color={priceNotAvailable ? 'light15' : 'light100'}
          type={'headerMarketDataPrice'}>
          {priceLabel}
        </ScalableLabel>
        {!priceNotAvailable ? (
          <AnimatedNumbers
            testID="PriceChangeLabel"
            layout={CurvedTransition}
            value={percentageLabel}
            type={isHigh ? 'boldTitleMarketDataPercentageLarge' : 'boldTitleMarketDataPercentage'}
            fontSize={isHigh ? Typography.boldTitleMarketDataPercentageLarge.fontSize : Typography.boldTitleMarketDataPercentage.fontSize}
            color={color}
            style={[styles.animatedNumbers, isHigh && styles.percentagePosHigh]}
            glyphSize={isHigh ? 24 : 16}
          />
        ) : (
          <View style={styles.percentageLabelPlaceholder} />
        )}
      </View>

      {!(priceNotAvailable && size === SheetPosition.HIGH) && (
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
          <PeriodSwitcher onChange={onChangePeriod} disabled={priceNotAvailable} />
          {highLowData && size === SheetPosition.HIGH && (
            <HighLowPriceChange color={dataInitialised ? color : 'transparent'} highLow={highLowData} period={period} currentPrice={token?.price} />
          )}
        </>
      )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  percentageLabelPlaceholder: {
    height: 28,
  },
  animatedNumbers: {
    flex: 1,
    marginBottom: 3,
  },
  percentagePosHigh: {
    marginTop: 10,
  },
  pricePosHigh: {
    marginTop: 4,
  },
});
