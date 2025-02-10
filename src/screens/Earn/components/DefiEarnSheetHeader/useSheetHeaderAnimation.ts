import type { LayoutChangeEvent } from 'react-native';

import { useCallback, useState } from 'react';

import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { EARN_SHEET_ANIMATION_CONFIG } from '../../EarnScreen.constants';

import type { UseSheetHeaderAnimationProps } from './DefiEarnSheetHeader.types';

export const useSheetHeaderAnimation = ({ isHeaderShrunk, tokenAmountFormatted }: UseSheetHeaderAnimationProps) => {
  const [expandedHeaderHeight, setExpandedHeaderHeight] = useState(0);

  const headerStyle = useAnimatedStyle(() => {
    const headerMinHeight = tokenAmountFormatted === '0' ? 140 : 80;

    if (expandedHeaderHeight === 0) {
      return {};
    }

    return {
      height: withTiming(isHeaderShrunk.value ? headerMinHeight : expandedHeaderHeight, EARN_SHEET_ANIMATION_CONFIG),
    };
  });

  const tokenIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isHeaderShrunk.value ? 0 : 1, EARN_SHEET_ANIMATION_CONFIG),
    transform: [
      {
        scale: withTiming(isHeaderShrunk.value ? 0 : 1, EARN_SHEET_ANIMATION_CONFIG),
      },
    ],
  }));

  const copyStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isHeaderShrunk.value ? -120 : 0, EARN_SHEET_ANIMATION_CONFIG),
      },
    ],
  }));

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (expandedHeaderHeight > 0) {
        return;
      }

      const { height } = event.nativeEvent.layout;
      setExpandedHeaderHeight(height);
    },
    [expandedHeaderHeight, setExpandedHeaderHeight],
  );

  return {
    headerStyle,
    tokenIconStyle,
    copyStyle,
    onLayout,
  };
};
