import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { forwardRef } from 'react';
import { NativeScrollEvent } from 'react-native/types';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useRefreshControlGesture } from './hooks/useRefreshControlGesture';

type Props<T> = Omit<FlashListProps<T>, 'onScroll' | 'scrollEventThrottle'> & {
  onRefresh: () => void;
  onScrollEvent?: (e: NativeScrollEvent) => void;
};

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as typeof FlashList;

const FlashListWithRefreshAndroidInner = <T,>({ style, onRefresh, onScrollEvent, ...props }: Props<T>, ref: React.Ref<FlashList<T>>) => {
  const { gesture, scrollHandler, translateStyle } = useRefreshControlGesture(onRefresh, onScrollEvent);
  return (
    <GestureDetector gesture={gesture}>
      <AnimatedFlashList<T> ref={ref} style={[style, translateStyle]} scrollEventThrottle={16} onScroll={scrollHandler} {...props} />
    </GestureDetector>
  );
};

export const FlashListWithRefreshAndroid = forwardRef(FlashListWithRefreshAndroidInner) as <T>(
  props: Props<T> & { ref?: React.Ref<FlashList<T>> },
) => React.ReactElement;
