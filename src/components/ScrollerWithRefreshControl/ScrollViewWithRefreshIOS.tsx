import React from 'react';
import { NativeScrollEvent } from 'react-native';
import Animated, { AnimatedScrollViewProps } from 'react-native-reanimated';

import { useRefreshControlScrollProps } from './hooks/useRefreshControlScrollProps';

type Props = AnimatedScrollViewProps & {
  onRefresh: () => void;
  onScrollEvent?: (e: NativeScrollEvent) => void;
};

export const ScrollViewWithRefreshIOS: React.FC<Props> = ({ children, onRefresh, onScrollEvent, ...props }) => {
  const { onScroll, onBeginDrag } = useRefreshControlScrollProps(onRefresh, onScrollEvent);

  return (
    <Animated.ScrollView scrollEventThrottle={16} onScroll={onScroll} onScrollBeginDrag={onBeginDrag} {...props}>
      {children}
    </Animated.ScrollView>
  );
};
