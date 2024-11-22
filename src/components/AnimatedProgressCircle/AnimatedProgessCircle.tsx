import { View } from 'react-native';
import Animated, { type SharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { type ColorName, useTheme } from '@/theme/themes';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type Props = {
  size?: number;
  strokeWidth?: number;
  backgroundColor?: ColorName;
  color?: ColorName;
  progress: SharedValue<number>;
};

export const AnimatedProgressCircle: React.FC<Props> = ({ progress, size = 20, strokeWidth = 2, backgroundColor = 'purple_40', color = 'light75' }) => {
  const { colors } = useTheme();

  const actualSize = size - 2 * strokeWidth;
  const R = actualSize / 2;
  const CIRCLE_LENGTH = R * 2 * Math.PI;

  const circleProps = useAnimatedProps(
    () => ({
      strokeDashoffset: CIRCLE_LENGTH - CIRCLE_LENGTH * progress.value,
    }),
    [],
  );

  return (
    <View style={{ width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={R} fillOpacity={0} stroke={colors[backgroundColor]} strokeWidth={strokeWidth} />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fillOpacity={0}
          stroke={colors[color]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={circleProps}
        />
      </Svg>
    </View>
  );
};
