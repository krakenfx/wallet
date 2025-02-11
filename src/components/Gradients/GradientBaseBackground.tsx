import type { StyleProp, ViewStyle } from 'react-native';

import type { NumberProp, StopProps } from 'react-native-svg';

import { type ComponentProps } from 'react';

import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export type GradientBaseBackgroundProps = Pick<ComponentProps<typeof Animated.View>, 'entering' | 'exiting'> & {
  style?: StyleProp<ViewStyle>;
  x1?: NumberProp;
  x2?: NumberProp;
  y1?: NumberProp;
  y2?: NumberProp;
  stops: StopProps[];
};

export const GradientBaseBackground: React.FC<GradientBaseBackgroundProps> = ({ style, stops, x1 = '0%', y1 = '0%', x2 = '100%', y2 = '0%', ...viewProps }) => {
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style, styles.noOverflow]} {...viewProps}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="linearGradient" gradientUnits="userSpaceOnUse" x1={x1} x2={x2} y1={y1} y2={y2}>
            {stops.map(props => (
              <Stop key={props.offset} {...props} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#linearGradient)" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  noOverflow: {
    overflow: 'hidden',
  },
});
