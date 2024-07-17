import { useCallback, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native/types';

export const useRefreshControlScrollProps = (onRefresh: () => void, onScrollEvent?: (e: NativeScrollEvent) => void, refreshThreshold = 30) => {
  const hasTriggered = useRef<boolean>(false);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (e.nativeEvent.contentOffset.y < -refreshThreshold && !hasTriggered.current) {
        hasTriggered.current = true;
        onRefresh();
      }
      onScrollEvent?.(e.nativeEvent);
    },
    [onRefresh, onScrollEvent, refreshThreshold],
  );

  const onBeginDrag = useCallback(() => {
    hasTriggered.current = false;
  }, []);

  return {
    onBeginDrag,
    onScroll,
  };
};
