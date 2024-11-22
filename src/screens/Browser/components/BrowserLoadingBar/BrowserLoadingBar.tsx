import type React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/themes';

interface LoadingBarProps {
  percentage: SharedValue<number>;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ percentage }) => {
  const dimensions = useWindowDimensions();
  const { colors } = useTheme();

  const loadingBarStyle = useAnimatedStyle(() => ({
    width: withTiming(dimensions.width * percentage.value, {
      duration: 100,
      easing: Easing.in(Easing.linear),
    }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loadingBar, { backgroundColor: colors.kraken }, loadingBarStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  loadingBar: {
    height: '100%',
  },
});
