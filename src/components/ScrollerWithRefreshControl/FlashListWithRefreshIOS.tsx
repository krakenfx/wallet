import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { forwardRef } from 'react';
import { NativeScrollEvent } from 'react-native/types';
import Animated from 'react-native-reanimated';

import { useRefreshControlScrollProps } from './hooks/useRefreshControlScrollProps';

type Props<T> = Omit<FlashListProps<T>, 'scrollEventThrottle' | 'onScrollBeginDrag'> & {
  onRefresh: () => void;
  onScrollEvent?: (e: NativeScrollEvent) => void;
};

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as typeof FlashList;

const FlashListWithRefreshIOSInner = <T,>({ children, onRefresh, onScrollEvent, ...props }: Props<T>, ref: React.Ref<FlashList<T>>) => {
  const { onScroll, onBeginDrag } = useRefreshControlScrollProps(onRefresh, onScrollEvent);
  return (
    <AnimatedFlashList ref={ref} {...props} onScroll={onScroll} onScrollBeginDrag={onBeginDrag}>
      {children}
    </AnimatedFlashList>
  );
};

export const FlashListWithRefreshIOS = forwardRef(FlashListWithRefreshIOSInner) as <T>(
  props: Props<T> & { ref?: React.Ref<FlashList<T>> },
) => React.ReactElement;
