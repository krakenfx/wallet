import { useState } from 'react';
import { interpolate, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { runAfterUISync } from '@/utils/runAfterUISync';

export const useFiatAmountToggle = (onToggle?: (inputInFiat: boolean) => void) => {
  const [inputInFiatCurrency, setInputInFiatCurrency] = useState(false);
  const toggleAnimation = useSharedValue(0);

  const switchInputMode = () => {
    setInputInFiatCurrency(value => {
      if (onToggle) {
        onToggle(!value);
      }
      return !value;
    });
  };

  const toggleInputFiatCurrency = () => {
    runAfterUISync(switchInputMode);
    toggleAnimation.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 200 }));
  };

  const opacity = useAnimatedStyle(() => ({
    opacity: interpolate(toggleAnimation.value, [0, 1], [1, 0]),
  }));

  const moveUp = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(toggleAnimation.value, [0, 1], [0, -8]) }],
  }));

  const moveDown = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(toggleAnimation.value, [0, 1], [0, 8]) }],
  }));

  return {
    inputInFiatCurrency,
    toggleInputFiatCurrency,
    styles: {
      opacity,
      moveDown,
      moveUp,
    },
  };
};
