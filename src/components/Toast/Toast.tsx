import Clipboard from '@react-native-clipboard/clipboard';
import { BlurView } from '@react-native-community/blur';
import LottieView, { LottieViewProps } from 'lottie-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { SharedValue, interpolate, runOnJS, useAnimatedStyle } from 'react-native-reanimated';

import { Label, LabelProps } from '@/components/Label';
import { IconName, SvgIcon } from '@/components/SvgIcon';
import { useDeafultHeaderHeight } from '@/hooks/useDefaultHeaderHeight';
import { Routes } from '@/Routes';
import { Theme, useTheme } from '@/theme/themes';
import { SupportedFeedbackType, hapticFeedback } from '@/utils/hapticFeedback';

type WhiteOrBlackListRoutes =
  | {
      blackListRoutes?: Routes[];
      whiteListRoutes?: never;
    }
  | {
      whiteListRoutes?: Routes[];
      blackListRoutes?: never;
    };

export type ToastConfigProps = {
  text: string;
  icon?: IconName;
  iconLottieSource?: LottieViewProps['source'];
  type: 'error' | 'info' | 'success';
  topOffset?: number;
  noIcon?: boolean;
  duration?: number;
  dismissMode?: DismissMode;
  id?: string;
  testID?: string;
  hapticFeedbackOnShow?: SupportedFeedbackType;
} & WhiteOrBlackListRoutes;

export type HideToastProps = {
  id?: string;
};

export enum ToastState {
  GONE = 0,
  IN = 1,
  OUT = 2,
}

type DismissMode = 'auto' | 'onlyManual' | 'preventManual' | 'event';

type ToastProps = ToastConfigProps & {
  visibility: SharedValue<number>;
  onDismiss: () => void;
};

const TOAST_CONFIG: Record<
  ToastProps['type'],
  {
    backgroundColor: keyof Theme['colors'];
    textColor: Extract<LabelProps['color'], 'red400' | 'light100' | 'green400'>;
    defaultIcon?: IconName;
  }
> = {
  error: {
    backgroundColor: 'red400_15',
    textColor: 'red400',
    defaultIcon: 'error',
  },
  info: {
    backgroundColor: 'light15',
    textColor: 'light100',
  },
  success: {
    backgroundColor: 'green400_15',
    textColor: 'green400',
    defaultIcon: 'check-circle',
  },
};

export const Toast = ({
  text,
  icon,
  type,
  visibility,
  topOffset = 8,
  onDismiss,
  noIcon,
  dismissMode,
  iconLottieSource,
  hapticFeedbackOnShow,
  testID = 'Toast',
}: ToastProps) => {
  const theme = useTheme();

  const colors = theme.colors;

  const config = TOAST_CONFIG[type];
  const headerHeight = useDeafultHeaderHeight(true);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(visibility.value, [ToastState.GONE, ToastState.IN, ToastState.OUT], [0.75, 1, 0.75]) },
      { translateY: interpolate(visibility.value, [ToastState.GONE, ToastState.IN, ToastState.OUT], [-30, 0, 0]) },
    ],
    opacity: interpolate(visibility.value, [ToastState.GONE, ToastState.IN, ToastState.OUT], [0, 1, 0]),
  }));

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (__DEV__) {
      runOnJS(Clipboard.setString)(text);
    }
    if (dismissMode !== 'preventManual') {
      onDismiss();
    }
  });

  useEffect(() => {
    if (hapticFeedbackOnShow) {
      hapticFeedback[hapticFeedbackOnShow]();
    }
  }, [hapticFeedbackOnShow]);

  const iconName = noIcon ? undefined : icon || config.defaultIcon;

  return (
    <Animated.View style={[styles.container, { marginTop: headerHeight + topOffset }, animatedStyle]}>
      <View style={[StyleSheet.absoluteFill, styles.noOverflow, styles.radius]}>
        {Platform.OS === 'ios' && <BlurView style={[StyleSheet.absoluteFill, styles.radius]} blurType="ultraThinMaterialDark" />}
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          Platform.OS === 'ios' && styles.iOSOverlay,
          { backgroundColor: Platform.select({ ios: colors.background, android: colors.androidToastBlur }) },
          styles.radius,
        ]}
      />
      <GestureDetector gesture={tapGesture}>
        <View style={[styles.component, { backgroundColor: colors[config.backgroundColor] }, styles.radius]} testID={testID}>
          {!!iconName && <SvgIcon name={iconName} color={config.textColor} size={13} />}
          {!!iconLottieSource && (
            <View style={styles.lottie}>
              <LottieView source={iconLottieSource} loop autoPlay style={StyleSheet.absoluteFill} />
            </View>
          )}
          <Label style={[styles.text, (iconName || !!iconLottieSource) && styles.textWithIcon]} type="boldCaption1" color={config.textColor} numberOfLines={2}>
            {text}
          </Label>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 24,
  },
  noOverflow: {
    overflow: 'hidden',
  },
  radius: {
    borderRadius: 16,
  },
  iOSOverlay: {
    opacity: 0.3,
  },
  component: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: 'center',
    alignItems: 'center',
  },
  text: {
    lineHeight: 16,
  },
  textWithIcon: {
    marginLeft: 6,
  },
  lottie: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
