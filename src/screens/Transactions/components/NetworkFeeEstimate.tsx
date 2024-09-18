import React from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

type Props = {
  data?: FeeOptionsData;
  size: 'small' | 'medium' | 'big';
};

import { FeeOptionsData } from '@/screens/Send/utils/getFeeOptionsData';

import { GeneralMarketDataItem } from './TokenMarketData/GeneralMarketDataItem';
import { commonStyles } from './TokenMarketData/styles';

import loc from '/loc';

export const NetworkFeeEstimate: React.FC<Props> = ({ data, size }) => {
  if (size !== 'big') {
    return (
      <Animated.View
        testID={`NetworkFeeEstimate-${size}`}
        style={[commonStyles.infoContainer, styles.spaceEvenly, size === 'small' && commonStyles.small, size === 'medium' && commonStyles.medium]}>
        <GradientItemBackground />
        {size === 'medium' && (
          <Label type="boldCaption2" color="light75">
            {loc.marketData.networkFee.title}
          </Label>
        )}
        <GeneralMarketDataItem isRow label={loc.marketData.networkFee.current} value={data?.amount} />
        {(size === 'medium' || data?.duration) && <GeneralMarketDataItem isRow label={loc.marketData.networkFee.duration} value={data?.duration} />}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={styles.containerBig} entering={FadeIn} testID={`NetworkFeeEstimate-${size}`}>
      <GradientItemBackground />
      <View style={styles.column}>
        <Label type="boldBody">{loc.marketData.networkFee.title}</Label>
        {!!data?.duration && (
          <Label type="mediumBody" color="light50">
            {data.duration}
          </Label>
        )}
      </View>
      <View style={styles.column}>
        <Label type="boldMonospace" style={styles.textRight}>
          {data?.amount}
        </Label>
        {!!data?.rate && (
          <Label type="regularCaption1" color="light50" style={styles.textRight}>
            {data.rate}
          </Label>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  containerBig: {
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    justifyContent: 'space-evenly',
  },
  textRight: {
    textAlign: 'right',
  },
});
