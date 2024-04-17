import { BottomSheetFooterProps, BottomSheetScrollView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import React, { RefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  AnimateStyle,
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

import { BottomSheet, BottomSheetRef } from '@/components/BottomSheet';

import { ExpandableSheetFooter } from './ExpandableSheetFooter';
import { ExpandableSheetMethods } from './types';

export type ExpandableSheetProps<P> = {
  FloatingButtonsComponent?: React.FC<ExpandableSheetMethods & P> | null | false | undefined;
  PreviewComponent: React.FC<ExpandableSheetMethods>;
  DetailsComponent?: React.FC<ExpandableSheetMethods> | null | false | undefined;
  StickyHeaderComponent?: React.FC<{ collapsibleSectionStyle: StyleProp<AnimateStyle<StyleProp<ViewStyle>>> }>;
  onDismiss?: () => void;
  dismissible?: boolean;
  extraPaddingBottom?: number;
  floatingButtonsProps?: P;
};

export const ExpandableSheet = forwardRef<ExpandableSheetMethods, ExpandableSheetProps<any>>(
  (
    {
      PreviewComponent,
      DetailsComponent,
      FloatingButtonsComponent,
      StickyHeaderComponent,
      onDismiss,
      dismissible,
      extraPaddingBottom = 16,
      floatingButtonsProps,
    },
    ref,
  ) => {
    const sheetRef = useRef<BottomSheetRef>(null);
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
        close: () => sheetRef.current?.close(),
        collapse: () => sheetRef.current?.collapse(),
        expand: () => sheetRef.current?.expand(),
      }),
      [],
    );

    useImperativeHandle(ref, () => sheetMethods, [sheetMethods]);

    const detailsElement = useMemo(() => !!DetailsComponent && <DetailsComponent {...sheetMethods} />, [DetailsComponent, sheetMethods]);
    const footerElement = useMemo(
      () => !!FloatingButtonsComponent && <FloatingButtonsComponent {...sheetMethods} {...floatingButtonsProps} />,
      [FloatingButtonsComponent, sheetMethods, floatingButtonsProps],
    );

    const canShowMore = !!detailsElement;

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
          FooterElement={footerElement}
          {...sheetMethods}
          {...props}
        />
      ),
      [canShowMore, animatedSnapPoints, animatedIndex, footerElement, sheetMethods],
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

    return (
      <BottomSheet
        ref={sheetRef}
        handleAndroidBackButton
        dismissible={dismissible}
        contentHeight={animatedContentHeight}
        handleHeight={animatedHandleHeight}
        snapPoints={snapPoints}
        animatedPosition={animatedPosition}
        animatedIndex={animatedIndex}
        footerComponent={renderFooter}
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
          <View onLayout={onLayout}>
            <PreviewComponent {...sheetMethods} />
          </View>
          {!!DetailsComponent && <Animated.View style={collapsedContentStyle}>{detailsElement}</Animated.View>}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
) as <T extends {}>(p: ExpandableSheetProps<T> & { ref?: RefObject<ExpandableSheetMethods> }) => React.ReactElement;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 12,
  },
  contentDetails: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
