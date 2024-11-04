import type { ViewStyle } from 'react-native';

import React, { useCallback, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { hapticFeedback } from '@/utils/hapticFeedback';

import { useLongPress } from './LongPressContext';

import type { LongPressOptionItemProps } from './LongPressOptionItem';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  withXPosition?: boolean;
  options: LongPressOptionItemProps[];
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
}

export const LongPressable = ({ children, style, withXPosition, options, onLongPressStart, onLongPressEnd }: Props) => {
  const { onLongPress, setStyles, setOptions } = useLongPress();
  const elRef = useRef<Animated.View>(null);

  const handleLongPress = useCallback(() => {
    if (elRef.current) {
      elRef.current.measure((_x, _y, _width, _height, pageX, pageY) => {
        hapticFeedback.impactHeavy();
        setStyles(style ?? {});
        setOptions(options);
        onLongPress(children, withXPosition ? pageX : 0, pageY, onLongPressEnd);
        onLongPressStart?.();
      });
    }
  }, [children, onLongPress, onLongPressEnd, onLongPressStart, options, setOptions, setStyles, style, withXPosition]);

  const longPress = Gesture.LongPress().minDuration(200).onStart(handleLongPress);

  return (
    <GestureDetector gesture={longPress}>
      <Animated.View ref={elRef}>{children}</Animated.View>
    </GestureDetector>
  );
};
