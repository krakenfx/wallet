import React, { useState } from 'react';

import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { CurvedTransition, Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { PriceHistoryPeriod } from '@/realm/tokenPrice';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

const PERIOD_COUNT = 5;
const padding = 4;

interface Props {
  onChange: (value: PriceHistoryPeriod) => void;
  disabled?: boolean;
}

export const PeriodSwitcher = ({ onChange, disabled }: Props) => {
  const [index, setIndex] = useState(0);
  const animation = useSharedValue(0);

  const { colors } = useTheme();
  const leftWidth = useSharedValue(0);
  const fullWidth = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const realWidth = fullWidth.value - 2 * padding;
    return {
      width: interpolate(fullWidth.value, [0, 1], [animation.value, realWidth / PERIOD_COUNT], { extrapolateRight: Extrapolate.CLAMP }),
      left: interpolate(animation.value, [0, PERIOD_COUNT - 1], [0, fullWidth.value - realWidth / PERIOD_COUNT], {
        extrapolateRight: Extrapolate.CLAMP,
        extrapolateLeft: Extrapolate.CLAMP,
      }),
    };
  });

  const handleTap = (value: number, period: PriceHistoryPeriod) => {
    if (disabled) {
      return;
    }
    setIndex(value);
    animation.value = withTiming(value ?? 0);
    onChange(period);
  };

  const renderItem = (value: number, text: string, period: PriceHistoryPeriod) => {
    return (
      <Touchable
        activeOpacity={1}
        onPress={() => handleTap(value, period)}
        style={styles.itemWrapper}
        onLayout={e => (leftWidth.value = e.nativeEvent.layout.width)}>
        <Label type="mediumBody" color={disabled ? 'light15' : index === value ? 'light100' : 'light50'}>
          {text}
        </Label>
      </Touchable>
    );
  };

  return (
    <Animated.View style={[styles.toggleWrapper]} layout={CurvedTransition}>
      <TouchableWithoutFeedback>
        <Animated.View style={[styles.container]}>
          <GradientItemBackground />
          <View style={styles.periods} onLayout={e => (fullWidth.value = e.nativeEvent.layout.width)}>
            {!disabled && <Animated.View style={[style, styles.slider, { backgroundColor: colors.purple_40 }]} />}
            {renderItem(0, loc.marketData.period.day, 'DAY')}
            {renderItem(1, loc.marketData.period.week, 'WEEK')}
            {renderItem(2, loc.marketData.period.month, 'MONTH')}
            {renderItem(3, loc.marketData.period.year, 'YEAR')}
            {renderItem(4, loc.marketData.period.all, 'ALL')}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 100,
    alignItems: 'center',
    height: 40,
    overflow: 'hidden',
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  slider: {
    position: 'absolute',
    height: '100%',
    borderRadius: 100,
    marginVertical: 4,
  },
  periods: {
    height: '100%',
    marginHorizontal: 4,
    paddingVertical: padding,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
});
