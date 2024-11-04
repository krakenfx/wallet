import { useMemo, useState } from 'react';

import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { NativeScrollEvent } from 'react-native/types';

export const useRefreshControlGesture = (onRefresh: () => void, onScrollEvent?: (e: NativeScrollEvent) => void, refreshThreshold = 30, stiffness = 50) => {
  const scrollOffset = useSharedValue(0);

  const panValue = useSharedValue(0);
  const hasTriggered = useSharedValue(false);

  const translateStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: panValue.value }],
    }),
    [],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollOffset.value = event.contentOffset.y;
      if (event.contentOffset.y < -refreshThreshold && !hasTriggered.value) {
        runOnJS(onRefresh)();
        hasTriggered.value = true;
      }
      onScrollEvent?.(event);
    },
  });

  const [panEnabled, setPanEnabled] = useState(true);

  useAnimatedReaction(
    () => scrollOffset.value <= 0,
    (canPan, prev) => {
      if (prev !== canPan) {
        runOnJS(setPanEnabled)(canPan);
      }
    },
    [scrollOffset],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(panEnabled)
        .minDistance(5)
        .failOffsetY(-1)
        .onChange(e => {
          const newValue = panValue.value + e.changeY;
          const progress = 1 / (newValue / stiffness);
          const interpolationFactor = Math.max(0, Math.min(progress, 1));
          panValue.value = panValue.value + e.changeY * interpolationFactor;
          if (newValue > refreshThreshold && !hasTriggered.value) {
            hasTriggered.value = true;
            runOnJS(onRefresh)();
          }
        })
        .onEnd(() => {
          panValue.value = withSpring(0, { overshootClamping: true });
          hasTriggered.value = false;
        }),
    [panValue, hasTriggered, stiffness, onRefresh, panEnabled, refreshThreshold],
  );

  return {
    translateStyle,
    gesture,
    scrollOffset,
    scrollHandler,
  };
};
