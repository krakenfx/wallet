import React from 'react';
import { StyleSheet } from 'react-native';

import Animated, { CurvedTransition } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { useAppCurrency } from '@/realm/settings';
import { useTokenById } from '@/realm/tokens';
import { formatCurrency } from '@/utils/formatCurrency';

import { GeneralMarketDataItem } from './GeneralMarketDataItem';
import { commonStyles } from './utils';

import loc from '/loc';

interface Props {
  tokenId: string;
}
export const GeneralMarketDataMediumInfo = ({ tokenId }: Props) => {
  const token = useTokenById(tokenId);
  const { currency } = useAppCurrency();

  const formatValue = (value: number | undefined | null): string | undefined => {
    if (!value) {
      return undefined;
    }
    return formatCurrency(value, { compact: true, currency: currency });
  };

  return (
    <Animated.View testID="GeneralMarketDataMedium" layout={CurvedTransition} style={[commonStyles.infoContainer, commonStyles.medium, styles.container]}>
      <GradientItemBackground />
      <GeneralMarketDataItem isRow label={loc.marketData.volume24h.short} value={formatValue(token?.marketData?.volume24HR)} />
      <GeneralMarketDataItem isRow label={loc.marketData.marketCap.short} value={formatValue(token?.marketData?.marketCap)} />
      <GeneralMarketDataItem isRow label={loc.marketData.fullyDilutedValuation.short} value={formatValue(token?.marketData?.fullyDilutedValuation)} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
  },
});
