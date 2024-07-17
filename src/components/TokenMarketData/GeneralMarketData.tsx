import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { SvgIcon } from '@/components/SvgIcon';
import { RealmAssetMarketData } from '@/realm/assetMarketData';

import { useAppCurrency } from '@/realm/settings';
import { Routes } from '@/Routes';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import { GeneralMarketDataItem } from './GeneralMarketDataItem';

import loc from '/loc';

interface Props {
  marketData?: RealmAssetMarketData;
}

export const GeneralMarketData = ({ marketData }: Props) => {
  const navigation = useNavigation();
  const { currency } = useAppCurrency();

  const formatValue = (value: number | undefined | null, isCurrency: boolean): string | undefined => {
    if (!value) {
      return undefined;
    }

    if (isCurrency) {
      return formatCurrency(value, { compact: true, currency: currency, findFirstNonZeroDigits: true });
    } else {
      return formatTokenAmount(String(value), { compact: true, currency: currency });
    }
  };

  const handleInfoPress = () => {
    navigation.navigate(Routes.MarketDataInfo);
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="GeneralMarketData">
      <SvgIcon testID="InfoIcon" size={16} name="info-circle" style={styles.info} color="light35" onPress={handleInfoPress} />
      <View style={[styles.container, styles.isFirst]}>
        <GradientItemBackground />
        <GeneralMarketDataItem label={loc.marketData.marketCap.title} value={formatValue(marketData?.marketCap, true)} />
        <GeneralMarketDataItem label={loc.marketData.circulatingSupply.title} value={formatValue(marketData?.circulatingSupply, false)} />
        <GeneralMarketDataItem label={loc.marketData.fullyDilutedValuation.title} value={formatValue(marketData?.fullyDilutedValuation, true)} />
        <GeneralMarketDataItem label={loc.marketData.maxSupply.title} value={formatValue(marketData?.maxSupply, false)} />
        <GeneralMarketDataItem label={loc.marketData.volume24h.title} value={formatValue(marketData?.volume24HR, true)} />
        <GeneralMarketDataItem label={loc.marketData.totalSupply.title} value={formatValue(marketData?.totalSupply, false)} />
      </View>
      <View style={[styles.container, styles.isLast]}>
        <GradientItemBackground />
        <GeneralMarketDataItem label={loc.marketData.allTimeLow.title} value={formatValue(marketData?.allTimeLow, true)} />
        <GeneralMarketDataItem label={loc.marketData.allTimeHigh.title} value={formatValue(marketData?.allTimeHigh, true)} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: 16,
    rowGap: 12,
  },
  isFirst: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingBottom: 12,
  },
  isLast: {
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    marginTop: 1,
  },
  info: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
