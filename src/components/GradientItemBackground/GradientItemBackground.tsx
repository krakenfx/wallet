import type { StyleProp, ViewStyle } from 'react-native';

import type { StopProps } from 'react-native-svg';

import React, { type ComponentProps } from 'react';

import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/theme/themes';

export type GradientItemBackgroundProps = Pick<ComponentProps<typeof Animated.View>, 'entering' | 'exiting'> & {
  style?: StyleProp<ViewStyle>;
  backgroundType?: 'modal' | 'fullscreen' | 'modalLight';
};

const opacities = {
  modal: [0.07, 0.14, 0.16],
  modalLight: [0.25, 0.3, 0.35],
  fullscreen: [0.15, 0.17, 0.2],
};

export const GradientItemBackground: React.FC<GradientItemBackgroundProps> = React.memo(({ style, backgroundType = 'fullscreen', ...viewProps }) => {
  const {
    gradients: { itemBackground },
  } = useTheme();

  const stops: StopProps[] = [
    { offset: '0%', stopColor: itemBackground.stop1, stopOpacity: opacities[backgroundType][0] },
    { offset: '70%', stopColor: itemBackground.stop2, stopOpacity: opacities[backgroundType][1] },
    { offset: '100%', stopColor: itemBackground.stop3, stopOpacity: opacities[backgroundType][2] },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style, styles.noOverflow]} {...viewProps}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="linearGradient" gradientUnits="userSpaceOnUse">
            {stops.map(props => (
              <Stop key={props.offset} {...props} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#linearGradient)" />
      </Svg>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  noOverflow: {
    overflow: 'hidden',
  },
});
