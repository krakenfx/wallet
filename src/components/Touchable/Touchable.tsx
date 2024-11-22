import type { GestureResponderEvent, TouchableOpacityProps } from 'react-native';

import type { AnimatedProps } from 'react-native-reanimated';

import { throttle } from 'lodash';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import Animated from 'react-native-reanimated';

import type { SupportedFeedbackType } from '@/utils/hapticFeedback';
import { hapticFeedback } from '@/utils/hapticFeedback';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type TouchableAnimatedProps = Pick<AnimatedProps<TouchableOpacityProps>, 'style' | 'layout' | 'entering' | 'exiting'>;

export type TouchableProps = TouchableOpacityProps &
  TouchableAnimatedProps & {
    hapticFeedbackOnPress?: SupportedFeedbackType | 'none';
    hapticFeedbackOnLongPress?: SupportedFeedbackType | 'none';
  };

export const Touchable = ({ hapticFeedbackOnPress = 'impactLight', hapticFeedbackOnLongPress = 'impactHeavy', ...props }: TouchableProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePressWithFeedback = useCallback(
    throttle(
      (e: GestureResponderEvent) => {
        if (hapticFeedbackOnPress !== 'none') {
          hapticFeedback[hapticFeedbackOnPress]();
        }
        props.onPress?.(e);
      },
      200,
      { trailing: false },
    ),
    [props.onPress, hapticFeedbackOnPress],
  );
  const handleLongPressWithFeedback = (e: GestureResponderEvent) => {
    if (hapticFeedbackOnLongPress !== 'none') {
      hapticFeedback[hapticFeedbackOnLongPress]();
    }
    props.onLongPress?.(e);
  };

  return <AnimatedTouchableOpacity activeOpacity={0.8} {...props} onPress={handlePressWithFeedback} onLongPress={handleLongPressWithFeedback} />;
};
