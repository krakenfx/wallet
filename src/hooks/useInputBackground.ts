import { useCallback } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { InputProps } from '@/components/Input';
import { useTheme } from '@/theme/themes';

export const useInputBackground = (props: InputProps) => {
  const { colors } = useTheme();

  const bgColorName = props.backgroundColor || 'dark25';
  const focused = useSharedValue(props.autoFocus);
  const colorFocused = props.transparent ? colors.transparent : colors[bgColorName];
  const colorBlur = colors[bgColorName];

  const borderColorOnFocus = props.borderColorOnFocus ? colors[props.borderColorOnFocus] : colorFocused;
  const borderColorOnBlur = props.borderColorOnBlur ? colors[props.borderColorOnBlur] : props.errorText ? colors.red400 : 'transparent';

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(focused.value ? colorFocused : colorBlur),
    borderColor: withTiming(focused.value ? borderColorOnFocus : borderColorOnBlur),
    borderWidth: 1,
  }));

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      focused.value = true;
      props.onFocus?.(e);
    },
    [focused, props],
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      focused.value = false;
      props.onBlur?.(e);
    },
    [focused, props],
  );

  return {
    backgroundStyle,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
};
