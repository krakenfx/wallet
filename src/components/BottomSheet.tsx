import BottomSheetBase, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetModal as BottomSheetBaseModal,
  BottomSheetModalProps,
  BottomSheetProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import { HeaderHeightContext } from '@react-navigation/elements';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CriticalWarningBackground } from '@/components/CriticalWarningBackground';
import { useTheme } from '@/theme/themes';
import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { SheetGradientView } from '/modules/gradient-view';

type CustomProps = {
  index?: number;
  dismissible?: boolean;
  noSafeInsetTop?: boolean;
  onDismiss?: () => void;
  onBackdropPress?: () => void;
  noBackdrop?: boolean;
  handleAndroidBackButton?: boolean;
  isWarning?: boolean;
};

type BaseProps = CustomProps & BottomSheetProps;
type ModalProps = CustomProps & BottomSheetModalProps;
type BottomSheetBlurProps = BottomSheetBackgroundProps & Pick<CustomProps, 'isWarning'>;

export type BottomSheetRef = BottomSheetBase;
export type BottomSheetModalRef = BottomSheetBaseModal;

const Backdrop = (props: BottomSheetBackdropProps & { dismissible: boolean; onBackdropPress?: () => void }) => {
  const { colors } = useTheme();
  return (
    <BottomSheetBackdrop
      {...props}
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
      opacity={0.7}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      onPress={props.onBackdropPress}
      pressBehavior={props.dismissible ? 'close' : 'none'}
    />
  );
};

const ANIMATION_CONFIGS = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

function useBottomSheetProps<T extends BottomSheetRef | BottomSheetModalRef>(
  {
    index,
    dismissible = true,
    noSafeInsetTop,
    noBackdrop,
    onDismiss,
    animatedPosition,
    handleAndroidBackButton,
    isWarning,
    onBackdropPress,
    onChange,
    ...rest
  }: BaseProps | ModalProps,
  ref: React.ForwardedRef<T>,
) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
  const [currentIndex, setCurrentIndex] = useState<number>();

  const handleChange = useCallback(
    (newIndex: number) => {
      setCurrentIndex(newIndex);
      onChange?.(newIndex);
    },
    [onChange],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (noBackdrop ? null : <Backdrop {...props} onBackdropPress={onBackdropPress} dismissible={dismissible} />),
    [dismissible, noBackdrop, onBackdropPress],
  );

  const renderBottomSheetBlur = useCallback((props: BottomSheetBlurProps) => <BottomSheetBlur {...props} isWarning={isWarning} />, [isWarning]);

  const sheetRef = useRef<T>(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(sheetRef.current);
      } else {
        // @ts-ignore

        ref.current = sheetRef.current;
      }
    }
  }, [ref]);

  useAndroidBackButton(() => {
    if (!handleAndroidBackButton || currentIndex === undefined || currentIndex === -1) {
      return false;
    }
    if (dismissible && sheetRef.current) {
      sheetRef.current.close();
    }
    return true;
  });

  const topInset = useMemo(() => (noSafeInsetTop ? 0 : insets.top + Platform.select({ android: 12, default: 0 })), [insets.top, noSafeInsetTop]);

  return {
    animationConfigs: ANIMATION_CONFIGS,
    animatedPosition: animatedPosition,
    topInset,
    index: index || 0,
    backgroundComponent: renderBottomSheetBlur,
    backdropComponent: renderBackdrop,
    handleIndicatorStyle: styles.handle,
    enablePanDownToClose: dismissible,
    onClose: onDismiss,
    onDismiss,
    onChange: handleAndroidBackButton ? handleChange : onChange,
    containerHeight: height - headerHeight,
    overDragResistanceFactor: 5,
    containerStyle: styles.shadow,
    ref: sheetRef,
    ...rest,
  };
}

export const BottomSheet = forwardRef<BottomSheetRef, BaseProps>((props, ref) => {
  return <BottomSheetBase {...useBottomSheetProps(props, ref)} />;
});

export const BottomSheetModal = forwardRef<BottomSheetModalRef, ModalProps>((props, ref) => {
  return <BottomSheetBaseModal {...useBottomSheetProps({ handleAndroidBackButton: true, ...props }, ref)} />;
});

const BottomSheetBlur = (props: BottomSheetBlurProps) => {
  const style: StyleProp<ViewStyle> = [props.style, styles.background];

  const { height: availableHeight } = useSafeAreaFrame();

  const { colors } = useTheme();

  const gradientSizeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -availableHeight / 2 },
      { scaleY: (availableHeight - props.animatedPosition.value) / availableHeight },
      { translateY: availableHeight / 2 },
    ],
  }));

  return (
    <View {...props} style={style}>
      {}
      {Platform.OS === 'ios' ? (
        <BlurView blurType="ultraThinMaterialDark" reducedTransparencyFallbackColor={colors.background} style={[styles.background, StyleSheet.absoluteFill]} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.blurBackgroundAndroid }]} />
      )}
      <Animated.View style={gradientSizeStyle}>
        <SheetGradientView style={{ height: availableHeight }} />
        {props.isWarning && <CriticalWarningBackground />}
      </Animated.View>
    </View>
  );
};

export function BottomSheetFlashList<TItem>(props: FlashListProps<TItem>) {
  return <FlashList renderScrollComponent={BottomSheetScrollView as React.ComponentType<ScrollViewProps>} {...props} />;
}

export const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    overflow: 'hidden',
  },
  handle: {
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 4,
  },
  shadow: {
    elevation: 12,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 36,
  },
});
