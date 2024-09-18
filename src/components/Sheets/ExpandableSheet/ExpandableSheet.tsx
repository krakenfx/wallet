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

import { ExpandableSheetContextProvider } from './ExpandableSheetContext';
import { ExpandableSheetFooter } from './ExpandableSheetFooter';
import { ExpandableSheetMethods } from './types';

export type ExpandableSheetProps = {
  PreviewComponent: React.ReactNode;
  DetailsComponent?: React.ReactNode;
  FloatingButtonsComponent?: React.ReactNode;
  StickyHeaderComponent?: React.FC<{ collapsibleSectionStyle: StyleProp<AnimateStyle<StyleProp<ViewStyle>>> }>;

  onDismiss?: () => void;
  dismissible?: boolean;
  extraPaddingBottom?: number;
};



export const ExpandableSheet = forwardRef<ExpandableSheetMethods, ExpandableSheetProps>(
  ({ PreviewComponent, DetailsComponent, FloatingButtonsComponent, StickyHeaderComponent, onDismiss, dismissible, extraPaddingBottom = 16 }, ref) => {
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
          FooterElement={FloatingButtonsComponent}
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
      if (!stickyHeaderCollapsed.value && animatedIndex.value === 1 && event.nativeEvent.contentOffset.y > 5 ) {
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
      <ExpandableSheetContextProvider {...sheetMethods}>
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
            <View onLayout={onLayout}>{PreviewComponent}</View>

            {canShowMore && <Animated.View style={collapsedContentStyle}>{DetailsComponent}</Animated.View>}
          </BottomSheetScrollView>
        </BottomSheet>
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
});
