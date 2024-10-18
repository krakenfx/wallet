import { Easing, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Options {
  isExpanded: boolean;
  expandedHeight: number;
}

export const useBarStyle = (headerExpanded: SharedValue<boolean>, { isExpanded, expandedHeight }: Options) => {
  return useAnimatedStyle(() => {
    const visibility = headerExpanded.value === isExpanded;

    return {
      opacity: withTiming(visibility ? 1 : 0, {
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
      }),
      height: withTiming(visibility ? expandedHeight : 0, {
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
      }),
      transform: [
        {
          scaleY: withTiming(visibility ? 1 : 0.95, {
            duration: 300,
            easing: Easing.inOut(Easing.cubic),
          }),
        },
        {
          translateX: withTiming(visibility ? 0 : 10, {
            duration: 300,
            easing: Easing.inOut(Easing.cubic),
          }),
        },
      ],
    };
  });
};
