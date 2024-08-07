import React, { FC, PropsWithChildren } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const ListAnimatedItem: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {children}
    </Animated.View>
  );
};
