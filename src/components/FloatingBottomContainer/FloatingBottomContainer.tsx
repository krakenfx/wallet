import React, { Fragment, PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { AnimateStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAvoider } from '@/components/Keyboard';

export interface FloatingBottomContainerProps {
  style?: StyleProp<AnimateStyle<StyleProp<ViewStyle>>>;
  noAbsolutePosition?: boolean;
  bottomSpace?: number;
  useBottomInset?: boolean;
  avoidKeyboard?: boolean;
}

export const FloatingBottomContainer: React.FC<PropsWithChildren & FloatingBottomContainerProps> = ({
  children,
  style,
  noAbsolutePosition,
  useBottomInset = true,
  avoidKeyboard,
  bottomSpace = 16,
}) => {
  const insets = useSafeAreaInsets();

  const totalBottomSpace = (useBottomInset && !avoidKeyboard ? insets.bottom : 0) + bottomSpace;

  const Wrapper = avoidKeyboard ? KeyboardAvoider : Fragment;

  return (
    <Wrapper {...(avoidKeyboard ? { absolutePosition: !noAbsolutePosition, useBottomInset } : {})}>
      <Animated.View
        style={[style, noAbsolutePosition || avoidKeyboard ? [{ marginBottom: totalBottomSpace }] : [styles.absolute, { bottom: totalBottomSpace }]]}>
        {children}
      </Animated.View>
    </Wrapper>
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
