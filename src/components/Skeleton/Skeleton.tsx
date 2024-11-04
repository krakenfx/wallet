import type { StyleProp, ViewStyle } from 'react-native';

import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Skeleton = (props: Props) => {
  const { style } = props;
  const alpha = useSharedValue(0.75);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: alpha.value,
    };
  });

  useEffect(() => {
    alpha.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
  }, [alpha]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={animatedStyle}>
        <LottieView source={require('./assets/skeleton-loop.json')} autoPlay loop resizeMode="cover" style={[styles.shared, styles.loader]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  shared: { width: '100%', top: 0, bottom: 0, height: '100%' },
  loader: {
    opacity: 0.4,
    transform: [{ scaleX: 1.5 }],
  },
});
