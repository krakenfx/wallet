import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/themes';

import { StepItem } from './StepItem';

import type { StepItemProps } from './StepItem';

type Props = StepItemProps & {
  isActive?: boolean;
};

export const AnimatedStepItem: React.FC<Props> = ({ isActive, ...props }) => {
  const { colors } = useTheme();

  const inactiveStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isActive ? 0 : 1, { duration: 500 }),
    }),
    [isActive],
  );

  const activeStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isActive ? 1 : 0, { duration: 500 }),
    }),
    [isActive],
  );

  return (
    <Animated.View>
      <StepItem {...props} style={inactiveStyle} circleStyle={[styles.opacity, { backgroundColor: colors.purple_40 }]} />
      <StepItem {...props} textProps={{ color: 'light100', type: 'boldTitle1' }} style={[StyleSheet.absoluteFill, activeStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  opacity: {
    opacity: 0.5,
  },
});
