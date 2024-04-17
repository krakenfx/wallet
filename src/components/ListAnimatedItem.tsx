import React, { FC, PropsWithChildren } from 'react';
import Animated, { EntryExitAnimationFunction, FadeIn, FadeOut, withDelay, withTiming } from 'react-native-reanimated';

interface Props extends PropsWithChildren {
  index: number;
}

const EnteringAnimation =
  (delay: number): EntryExitAnimationFunction =>
  () => {
    'worklet';
    const animations = {
      opacity: withDelay(delay, withTiming(1, { duration: 200 })),
      transform: [{ scale: withDelay(delay, withTiming(1, { duration: 300 })) }, { translateY: withDelay(delay, withTiming(0, { duration: 200 })) }],
    };
    const initialValues = { opacity: 0, transform: [{ scale: 0.75 }, { translateY: -30 }] };
    return { initialValues, animations };
  };

const ExitingAnimation =
  (delay: number): EntryExitAnimationFunction =>
  () => {
    'worklet';
    const animations = { opacity: withDelay(delay, withTiming(0, { duration: 200 })) };
    const initialValues = { opacity: 1 };
    return { initialValues, animations };
  };

export const ListAnimatedItem: FC<Props> = ({ children, index }) => {
  const delay = index * 90;
  return (
    <Animated.View entering={EnteringAnimation(delay)} exiting={ExitingAnimation(delay)}>
      {children}
    </Animated.View>
  );
};

export const ListAnimatedItemFade: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {children}
    </Animated.View>
  );
};
