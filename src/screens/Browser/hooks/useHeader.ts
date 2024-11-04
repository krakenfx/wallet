import type { GestureResponderEvent } from 'react-native';

import { useRef } from 'react';

import { useSharedValue } from 'react-native-reanimated';

const MIN_SCROLL_THRESHOLD = 50;

export const useHeader = () => {
  const headerExpanded = useSharedValue(true);

  const onExpandHeader = () => (headerExpanded.value = true);

  const onCollapseHeader = () => (headerExpanded.value = false);

  const initialTouchY = useRef(0);

  const handleTouchStart = (event: GestureResponderEvent) => {
    
    initialTouchY.current = event.nativeEvent.pageY;
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    const currentTouchY = event.nativeEvent.pageY;
    const distanceMoved = Math.abs(currentTouchY - initialTouchY.current);

    if (distanceMoved < MIN_SCROLL_THRESHOLD) {
      return;
    }

    if (currentTouchY < initialTouchY.current && headerExpanded.value) {
      
      onCollapseHeader();
      return;
    }

    if (currentTouchY > initialTouchY.current && !headerExpanded.value) {
      
      onExpandHeader();
    }
  };

  return {
    headerExpanded,
    onExpandHeader,
    onCollapseHeader,
    handleTouchStart,
    handleTouchMove,
  };
};
