import { useCallback, useRef } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { useDefiDetailsContext } from './DefiDetailsContext';

import loc from '/loc';

const chartMetrics: Record<number, 'apy' | 'tvl'> = {
  0: 'apy',
  1: 'tvl',
};

const GAP = 8;
type Props = { unset: boolean };

export const DefiDetailsSwitch = ({ unset }: Props) => {
  const { colors } = useTheme();
  const { setChartMetric } = useDefiDetailsContext();
  const containerWidth = useRef(0);
  const translateX = useSharedValue(0);
  const animatedstyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const handlePress = useCallback(
    (cellIndex: number) => {
      if (!unset) {
        setChartMetric(chartMetrics[cellIndex]);
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

  return (
    <View style={styles.container} onLayout={onLayout}>
      {!unset && (
        <Animated.View
          style={[
            animatedstyle,
            styles.slider,
            {
              backgroundColor: colors.purple_40,
              width: containerWidth.current / 2 - GAP,
            },
          ]}
        />
      )}
      <Touchable onPress={handle0} style={[styles.cell, unset && { backgroundColor: colors.dark15 }]}>
        <Label type="boldCaption1" color="light50">
          {loc.earn.apy}
        </Label>
        <Label type="headerMarketDataPrice" color="green400" numberOfLines={1} adjustsFontSizeToFit>
          {'3.7%'}
        </Label>
      </Touchable>
      <Touchable onPress={handle1} style={[styles.cell, unset && { backgroundColor: colors.dark15 }]}>
        <Label type="boldCaption1" color="light50">
          {loc.earn.tvl}
        </Label>
        <Label type="headerMarketDataPrice" numberOfLines={1} adjustsFontSizeToFit>
          {'$16.5M'}
        </Label>
      </Touchable>
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
    marginTop: 10,
    gap: GAP,
  },
  cell: {
    flex: 1,
    width: '50%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  slider: {
    position: 'absolute',
    height: '100%',
    width: '50%',
    borderRadius: 16,
  },
});
