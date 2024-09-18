import React, { useRef } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label, TypographyKey } from '@/components/Label';
import { Theme } from '@/theme/themes';

const numberRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const getPosition = (value: string, height?: number) => {
  
  const int = parseInt(value, 10) || 0;

  return int * (height || 0) * -1;
};

type TickProps = {
  type: TypographyKey;
  value: string;
  fontSize: number;
  lineHeight: number;
  color?: keyof Theme['colors'];
};

export const Tick = ({ type, value, fontSize, lineHeight, color }: TickProps) => {
  const animation = useSharedValue(getPosition(value, fontSize));
  const lastValue = useRef('0');

  const animatedStyle = useAnimatedStyle(() => {
    if (global._WORKLET) {
      
      return {
        transform: [{ translateY: animation.value }],
      };
    }
    return {};
  });

  useEffect(() => {
    if (lastValue.current !== value) {
      
      animation.value = withTiming(getPosition(value, fontSize), { duration: 350, easing: Easing.bezier(0.62, 0.24, 0.4, 0.85) }, () => {});
    } else {
      animation.value = getPosition(value, fontSize);
    }
    lastValue.current = value;
  }, [animation, fontSize, value]);

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle} entering={FadeIn}>
        {numberRange.map(v => (
          <Label color={color} type={type} allowFontScaling={false} numberOfLines={1} key={v} style={{ lineHeight, fontSize }}>
            {v}
          </Label>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
});
