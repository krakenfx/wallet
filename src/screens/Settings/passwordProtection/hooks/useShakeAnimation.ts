import { useCallback } from 'react';
import { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export const useShakeAnimation = () => {
  const offset = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });

  const shake = useCallback(
    (callback?: () => void) => {
      offset.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 }, finished => {
          if (finished && callback) {
            runOnJS(callback)();
          }
        }),
      );
    },
    [offset],
  );

  return {
    shake,
    animatedStyle,
  };
};
