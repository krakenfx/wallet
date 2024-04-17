import { BottomSheetFooter, BottomSheetFooterProps, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleSheet, View } from 'react-native';
import Animated, { Extrapolate, SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Touchable } from '@/components/Touchable';

import { Label } from '../../Label';
import { SvgIcon } from '../../SvgIcon';

import loc from '/loc';

type CustomFooterProps<P> = {
  toggle: () => void;
  onLayout: (layout: LayoutRectangle) => void;
  animatedIndex: SharedValue<number>;
  snapPoints: ReturnType<typeof useBottomSheetDynamicSnapPoints>['animatedSnapPoints'];
  FooterElement: React.ReactElement | false | null | undefined;
  canShowMore: boolean;
  floatingButtonsProps?: P;
};

export type Props<P> = BottomSheetFooterProps & CustomFooterProps<P>;

export const ExpandableSheetFooter: React.FC<Props<{}>> = ({ toggle, snapPoints, animatedIndex, canShowMore, onLayout, FooterElement, ...otherProps }) => {
  const insets = useSafeAreaInsets();

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: interpolate(animatedIndex.value, [0.3, 0.7], [-1, 1], { extrapolateLeft: Extrapolate.CLAMP, extrapolateRight: Extrapolate.CLAMP }) }],
  }));

  const showMoreStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 0.45], [1, 0]),
  }));
  const showLessStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0.55, 1], [0, 1]),
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    onLayout(e.nativeEvent.layout);
  };

  const containerStyle = useAnimatedStyle(() => {
    const firstSnap = snapPoints.value[0];
    if (typeof firstSnap !== 'number') {
      return {};
    }
    return {
      transform: [{ translateY: interpolate(animatedIndex.value, [-1, 0], [firstSnap, 0], { extrapolateRight: Extrapolate.CLAMP }) }],
      opacity: interpolate(animatedIndex.value, [-0.25, 0], [0, 1]),
    };
  });

  return (
    <BottomSheetFooter {...otherProps}>
      <Animated.View onLayout={handleLayout} style={[{ paddingBottom: insets.bottom }, containerStyle]}>
        {FooterElement}
        {canShowMore && (
          <Touchable onPress={toggle}>
            <View>
              <Label style={[styles.label, showMoreStyle]}>{loc._.showMore}</Label>
              <Label style={[styles.label, showLessStyle]}>{loc._.showLess}</Label>
              <Animated.View style={[styles.chevron, arrowStyle]}>
                <SvgIcon name="chevron-down" />
              </Animated.View>
            </View>
          </Touchable>
        )}
      </Animated.View>
    </BottomSheetFooter>
  );
};

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  chevron: {
    marginVertical: 24,
    alignItems: 'center',
  },
});
