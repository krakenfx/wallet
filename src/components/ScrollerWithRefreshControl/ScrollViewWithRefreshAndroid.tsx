import type React from 'react';
import type { AnimatedScrollViewProps } from 'react-native-reanimated';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useRefreshControlGesture } from './hooks/useRefreshControlGesture';

import type { NativeScrollEvent } from 'react-native/types';

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
