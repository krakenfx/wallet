import React, { ComponentProps } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export type GradientIconBackgroundProps = Pick<ComponentProps<typeof Animated.View>, 'entering' | 'exiting'> & {
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export const GradientIconBackground: React.FC<GradientIconBackgroundProps> = React.memo(({ style, size = 40, ...viewProps }) => {
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style, styles.noOverflow]} {...viewProps}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="linearGradient" x1="0" y1={size / 2} x2={size} y2={size / 2} gradientUnits="userSpaceOnUse">
            <Stop stopColor="#282857" />
            <Stop offset="1" stopColor="#3F3095" />
          </LinearGradient>
        </Defs>

        <Rect width={size} height={size} rx={size / 2} fill="url(#linearGradient)" />
        <Rect width={size} height={size} rx={size / 2} fill="white" fillOpacity="0.08" />
      </Svg>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  noOverflow: {
    overflow: 'hidden',
  },
});
