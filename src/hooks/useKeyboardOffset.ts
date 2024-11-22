import { Platform } from 'react-native';
import { Extrapolation, interpolate, useAnimatedKeyboard, useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useKeyboardOffset = (extraOffset = 0, offsetBottomInsetWhenOpen = Platform.select({ ios: true, android: false }), useBottomInset = true) => {
  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const insets = useSafeAreaInsets();

  const defaultOffset = useDerivedValue(() => (useBottomInset ? insets.bottom : 0), [insets]);

  const keyboardOffset = useDerivedValue(() => {
    const negativeOffset = offsetBottomInsetWhenOpen
      ? interpolate(keyboard.height.value, [0, insets.bottom], [0, insets.bottom], {
          extrapolateRight: Extrapolation.CLAMP,
        })
      : 0;

    return defaultOffset.value + keyboard.height.value - negativeOffset + extraOffset;
  }, [insets, keyboard.height]);

  return keyboardOffset;
};
