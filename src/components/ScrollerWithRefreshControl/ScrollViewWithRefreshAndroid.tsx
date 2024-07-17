import React from 'react';
import { NativeScrollEvent } from 'react-native/types';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { AnimatedScrollViewProps } from 'react-native-reanimated';

import { useRefreshControlGesture } from './hooks/useRefreshControlGesture';

type Props = AnimatedScrollViewProps & {
  onRefresh: () => void;
  onScrollEvent?: (e: NativeScrollEvent) => void;
};

export const ScrollViewWithRefreshAndroid: React.FC<Props> = ({ children, style, onRefresh, onScrollEvent, ...props }) => {
  const { gesture, scrollHandler, translateStyle } = useRefreshControlGesture(onRefresh, onScrollEvent);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.ScrollView onScroll={scrollHandler} style={[style, translateStyle]} {...props}>
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  );
};
