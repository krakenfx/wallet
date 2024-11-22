import type React from 'react';

import { FlashList } from '@shopify/flash-list';
import { forwardRef } from 'react';

import Animated from 'react-native-reanimated';

import { useRefreshControlScrollProps } from './hooks/useRefreshControlScrollProps';

import type { FlashListProps } from '@shopify/flash-list';
import type { NativeScrollEvent } from 'react-native/types';

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
