import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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
    height: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  loadingBar: {
    height: '100%',
  },
});
