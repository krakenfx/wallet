import type React from 'react';

import { Platform, StyleSheet, type ViewProps } from 'react-native';

import Animated, { type AnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

import { useKeyboardOffset } from '@/hooks/useKeyboardOffset';

type Props = {
  extraOffset?: number;
  absolutePosition?: boolean;
  useBottomInset?: boolean;
  offsetBottomInsetWhenOpen?: boolean;
};
export const KeyboardAvoider: React.FC<AnimatedProps<ViewProps> & Props> = ({
  children,
  style,
  extraOffset = 0,
  absolutePosition,
  offsetBottomInsetWhenOpen = Platform.select({ ios: true, android: false }),
  useBottomInset = true,
  ...viewProps
}) => {
  const keyboardOffset = useKeyboardOffset(extraOffset, offsetBottomInsetWhenOpen, useBottomInset);

  const paddingStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboardOffset.value,
    };
  });

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
