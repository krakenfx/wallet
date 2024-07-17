import React from 'react';
import { Platform, StyleSheet, ViewProps } from 'react-native';
import Animated, { AnimateProps, Extrapolation, interpolate, useAnimatedKeyboard, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  extraOffset?: number;
  absolutePosition?: boolean;
  useBottomInset?: boolean;
  offsetBottomInsetWhenOpen?: boolean;
};
export const KeyboardAvoider: React.FC<AnimateProps<ViewProps> & Props> = ({
  children,
  style,
  extraOffset = 0,
  absolutePosition,
  offsetBottomInsetWhenOpen = Platform.select({ ios: true, android: false }),
  useBottomInset = true,
  ...viewProps
}) => {
  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const insets = useSafeAreaInsets();

  const defaultOffset = useDerivedValue(() => (useBottomInset ? insets.bottom : 0), [insets]);

  const paddingStyle = useAnimatedStyle(() => {
    const negativeOffset = offsetBottomInsetWhenOpen
      ? interpolate(keyboard.height.value, [0, insets.bottom], [0, insets.bottom], {
          extrapolateRight: Extrapolation.CLAMP,
        })
      : 0;

    return {
      paddingBottom: defaultOffset.value + keyboard.height.value - negativeOffset + extraOffset,
    };
  }, [insets]);

  return (
    <Animated.View style={[absolutePosition && styles.absolute, style, paddingStyle]} {...viewProps}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
