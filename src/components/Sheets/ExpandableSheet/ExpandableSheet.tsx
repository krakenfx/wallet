import type { RefObject } from 'react';

import type React from 'react';
import type { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleProp, ViewStyle } from 'react-native';

import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';

import { BottomSheetScrollView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import Animated, {
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheet, BottomSheetModal } from '@/components/BottomSheet';

import { ExpandableSheetContextProvider } from './ExpandableSheetContext';
import { ExpandableSheetFooter } from './ExpandableSheetFooter';

import type { ExpandableSheetMethods } from './types';
import type { BottomSheetFooterProps } from '@gorhom/bottom-sheet';

export type ExpandableSheetComponentProps = {
  animatedIndex: SharedValue<number>;
};

export type ExpandableSheetProps = {
  PreviewComponent: React.ReactNode | React.FC<ExpandableSheetComponentProps>;
  DetailsComponent?: React.ReactNode | React.FC<ExpandableSheetComponentProps>;
  FloatingButtonsComponent?: React.ReactNode | React.FC<ExpandableSheetComponentProps>;
  StickyHeaderComponent?: React.FC<{ collapsibleSectionStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>> }>;

  onDismiss?: () => void;
  dismissible?: boolean;
  extraPaddingBottom?: number;
  isModal?: boolean;
};

export const ExpandableSheet = forwardRef<ExpandableSheetMethods, ExpandableSheetProps>(
  ({ PreviewComponent, DetailsComponent, FloatingButtonsComponent, StickyHeaderComponent, onDismiss, dismissible, extraPaddingBottom = 16, isModal }, ref) => {
    const modalSheetRef = useRef<BottomSheetModalRef>(null);
    const scrollRef = useAnimatedRef<ScrollView>();
    const animatedIndex = useSharedValue<number>(0);
    const animatedPosition = useSharedValue<number>(0);
    const [footerLayout, setFooterLayout] = useState<LayoutRectangle>();
    const [previewLayout, setPreviewLayout] = useState<LayoutRectangle>();
    const [stickyHeaderLayout, setStickyHeaderLayout] = useState<LayoutRectangle>();
    const stickyHeaderCollapsed = useSharedValue(0);

    const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints([
      'CONTENT_HEIGHT',
      '100%',
    ]);

    const frame = useSafeAreaFrame();
    const insets = useSafeAreaInsets();

    useAnimatedReaction(
      () => animatedIndex.value < 0.5,
      (collapsing, prev) => {
        if (collapsing !== prev && collapsing) {
          scrollTo(scrollRef, 0, 0, true);
          stickyHeaderCollapsed.value = withTiming(0);
        }
      },
    );

    const sheetMethods = useMemo(
      () => ({
        close: () => {
          if (isModal) {
            modalSheetRef.current?.dismiss();
          } else {
            modalSheetRef.current?.close();
          }
        },
        collapse: () => modalSheetRef.current?.collapse(),
        expand: () => {
          if (isModal) {
            modalSheetRef.current?.present();
          }
          modalSheetRef.current?.expand();
        },
      }),
      [isModal],
    );

    useImperativeHandle(ref, () => sheetMethods, [sheetMethods]);

    const canShowMore = !!DetailsComponent;

    const paddingBottom = (footerLayout?.height ?? 0) + extraPaddingBottom;

    const collapsedContentStyle = useAnimatedStyle(() => ({
      opacity: interpolate(animatedIndex.value, [0, 1], [0, 1]),
    }));

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <ExpandableSheetFooter
          onLayout={setFooterLayout}
          canShowMore={canShowMore}
          snapPoints={animatedSnapPoints}
          animatedIndex={animatedIndex}
          toggle={() => {
            if (animatedIndex.value === 0) {
              sheetMethods.expand();
            } else {
              sheetMethods.collapse();
            }
          }}
          FooterElement={typeof FloatingButtonsComponent === 'function' ? <FloatingButtonsComponent animatedIndex={animatedIndex} /> : FloatingButtonsComponent}
          {...sheetMethods}
          {...props}
        />
      ),
      [canShowMore, animatedSnapPoints, animatedIndex, FloatingButtonsComponent, sheetMethods],
    );

    useEffect(() => {
      if (!previewLayout) {
        return;
      }

      if (StickyHeaderComponent && !stickyHeaderLayout) {
        return;
      }

      const stickyHeaderHeight = stickyHeaderLayout?.height ?? 0;

      handleContentLayout({ nativeEvent: { layout: { ...previewLayout, height: previewLayout.height + stickyHeaderHeight + paddingBottom } } });
    }, [handleContentLayout, paddingBottom, previewLayout, stickyHeaderLayout, StickyHeaderComponent]);

    const onLayout = (event: LayoutChangeEvent) => {
      setPreviewLayout(event.nativeEvent.layout);
    };

    const onStickyHeaderLayout = (event: LayoutChangeEvent) => {
      setStickyHeaderLayout(event.nativeEvent.layout);
    };

    const snapPoints = useDerivedValue(() => {
      if (!canShowMore) {
        return [animatedSnapPoints.value[0]];
      }
      return animatedSnapPoints.value;
    }, [canShowMore]);

    const onBottomSheetScrollViewScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!stickyHeaderCollapsed.value && animatedIndex.value === 1 && event.nativeEvent.contentOffset.y > 5) {
        stickyHeaderCollapsed.value = withTiming(1);
      } else if (animatedIndex.value === 1 && event.nativeEvent.contentOffset.y <= 5) {
        stickyHeaderCollapsed.value = withTiming(0);
      }
    };

    const collapsibleHeaderSectionStyle = useAnimatedStyle(
      () => ({
        ...(stickyHeaderLayout?.height && { maxHeight: interpolate(stickyHeaderCollapsed.value, [0, 1], [stickyHeaderLayout.height, 0]) }),
        transform: [{ scale: interpolate(stickyHeaderCollapsed.value, [0, 1], [1, 0]) }],
      }),
      [stickyHeaderLayout?.height],
    );

    const SheetComponent = isModal ? BottomSheetModal : BottomSheet;

    return (
      <ExpandableSheetContextProvider {...sheetMethods}>
        <SheetComponent
          ref={modalSheetRef}
          handleAndroidBackButton
          dismissible={dismissible}
          contentHeight={animatedContentHeight}
          handleHeight={animatedHandleHeight}
          snapPoints={snapPoints}
          animatedPosition={animatedPosition}
          animatedIndex={animatedIndex}
          footerComponent={renderFooter}
          handleStyle={!dismissible && styles.hiddenHandle}
          onDismiss={onDismiss}>
          {!!StickyHeaderComponent && (
            <View onLayout={stickyHeaderLayout ? undefined : onStickyHeaderLayout}>
              <StickyHeaderComponent collapsibleSectionStyle={collapsibleHeaderSectionStyle} />
            </View>
          )}

          <BottomSheetScrollView
            ref={scrollRef}
            onScroll={onBottomSheetScrollViewScroll}
            style={[
              styles.contentContainer,

              { maxHeight: frame.height - insets.bottom - insets.top - (stickyHeaderLayout?.height ?? 0) - (footerLayout?.height ?? 0) },
            ]}>
            <View onLayout={onLayout}>{typeof PreviewComponent === 'function' ? <PreviewComponent animatedIndex={animatedIndex} /> : PreviewComponent}</View>

            {canShowMore && (
              <Animated.View style={collapsedContentStyle}>
                {typeof DetailsComponent === 'function' ? <DetailsComponent animatedIndex={animatedIndex} /> : DetailsComponent}
              </Animated.View>
            )}
          </BottomSheetScrollView>
        </SheetComponent>
      </ExpandableSheetContextProvider>
    );
  },
) as (p: ExpandableSheetProps & { ref?: RefObject<ExpandableSheetMethods> }) => React.ReactElement;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 12,
  },
  contentDetails: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  hiddenHandle: {
    opacity: 0,
  },
});
