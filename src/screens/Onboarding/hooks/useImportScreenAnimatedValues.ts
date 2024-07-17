import { useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, Platform } from 'react-native';
import { Extrapolation, KeyboardState, interpolate, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_BUTTON_SPACE = 80;
const SUGGESTED_WORDS_SPACE = 56;
const INPUT_AREA_DEFAULT_HEIGHT = 300;
const INPUT_AREA_MARGIN = 16;

export const useImportScreenAnimatedValues = () => {
  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const insets = useSafeAreaInsets();
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle>();
  const [headerLayout, setHeaderLayout] = useState<LayoutRectangle>();

  const spaceBottomWhenExpanded = SUGGESTED_WORDS_SPACE + Platform.select({ android: insets.bottom, default: 0 });
  const spaceBottomWhenCollapsed = BOTTOM_BUTTON_SPACE + insets.bottom;
  const headerHeight = headerLayout?.height ?? 0;
  const containerHeight = containerLayout?.height ?? 0;

  const inputAreaStyle = useAnimatedStyle(() => {
    if (!headerHeight || !containerHeight) {
      return {};
    }
    const keyboardHeight = keyboard.height.value;
    const bottomElementSpace = interpolate(keyboard.height.value, [0, 100], [spaceBottomWhenCollapsed, spaceBottomWhenExpanded], {
      extrapolateRight: Extrapolation.CLAMP,
    });
    const occupiedSpace = keyboardHeight + bottomElementSpace + headerHeight;
    const maxHeight = containerHeight - occupiedSpace - 2 * INPUT_AREA_MARGIN;
    return {
      maxHeight,
      minHeight: Math.min(maxHeight, INPUT_AREA_DEFAULT_HEIGHT),
      margin: INPUT_AREA_MARGIN,
    };
  }, [containerHeight, headerLayout, keyboard, insets]);

  const suggestedWordsStyle = useAnimatedStyle(() => {
    switch (keyboard.state.value) {
      case KeyboardState.OPEN:
      case KeyboardState.OPENING:
        return { opacity: 1 };
      default:
        return { opacity: 0 };
    }
  });

  const handleContainerLayout = (event: LayoutChangeEvent) => setContainerLayout(event.nativeEvent.layout);
  const handleHeaderLayout = (event: LayoutChangeEvent) => setHeaderLayout(event.nativeEvent.layout);

  return {
    inputAreaStyle,
    suggestedWordsStyle,
    layoutHandlers: {
      container: handleContainerLayout,
      header: handleHeaderLayout,
    },
  };
};
