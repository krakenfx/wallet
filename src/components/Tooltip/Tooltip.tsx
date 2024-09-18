import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Animated, { ZoomInEasyUp } from 'react-native-reanimated';

import { useTheme } from '@/theme/themes';

interface Props extends PropsWithChildren {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  delayMs?: number;
}

export const Tooltip: React.FC<Props> = ({ children, containerStyle, delayMs = 0, style }) => {
  const { colors } = useTheme();

  return (
    <Animated.View entering={ZoomInEasyUp.duration(450).delay(delayMs)} style={containerStyle}>
      <View style={[styles.tip, { backgroundColor: colors.tooltipColor }]} />
      <View style={[styles.content, { backgroundColor: colors.tooltipColor }, style]}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tip: {
    width: 12,
    height: 12,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    right: 32,
    top: -6,
  },
  content: {
    borderRadius: 12,
    padding: 16,
  },
});
