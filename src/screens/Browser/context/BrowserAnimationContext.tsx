import type { LayoutChangeEvent, ViewStyle } from 'react-native';

import React, { type MutableRefObject, type PropsWithChildren } from 'react';

import { useContext, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { InputMethods } from '@/components/Input';

interface BrowserAnimationContextProps {
  onExitBrowser: () => void;
  goBackAnimations?: {
    inputXShift: number;
    inputYShift: number;
    inputTargetWidth: number;
    inputContentXShift: number;
  };
}

interface BrowserAnimationContextValue {
  inputRef: MutableRefObject<InputMethods | null>;
  shouldRunAnimations: boolean;
  animatedContentStyle: ViewStyle;
  animatedInputStyle: ViewStyle;
  animatedButtonStyle: ViewStyle;
  animatedWebViewStyle: ViewStyle;
  animatedPlaceholderStyle: ViewStyle;
  noSearchViewStyle: ViewStyle;
  onAnimateTransition: () => void;
  onInputContainerLayout: (event: LayoutChangeEvent) => void;
}

const BrowserAnimationContext = React.createContext<BrowserAnimationContextValue | undefined>(undefined);

const ANIMATION_CONFIG = {
  duration: 160,
  easing: Easing.inOut(Easing.linear),
};

export const BrowserAnimationContextProvider: React.FC<PropsWithChildren<BrowserAnimationContextProps>> = ({ onExitBrowser, goBackAnimations, children }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const inputRef = useRef<InputMethods>(null);

  const inputWidthAlreadyAdjusted = useRef(false);

  const inputWidth = useSharedValue(screenWidth);
  const inputFlex = useSharedValue(1);
  const inputTranslateX = useSharedValue(0);
  const inputTranslateY = useSharedValue(0);

  const contentTranslateX = useSharedValue(0);
  const placeholderTranslateX = useSharedValue(0);

  const noSearchViewOpacity = useSharedValue(1);

  const buttonOpacity = useSharedValue(1);

  const webViewTranslateY = useSharedValue(0);
  const webViewOpacity = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const animatedWebViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: webViewTranslateY.value }],
    opacity: webViewOpacity.value,
  }));

  const animatedPlaceholderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: placeholderTranslateX.value }],
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: inputTranslateX.value }, { translateY: inputTranslateY.value }],
    width: inputWidth.value,
    flex: inputFlex.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentTranslateX.value }],
  }));

  const noSearchViewStyle = useAnimatedStyle(() => ({
    opacity: noSearchViewOpacity.value,
  }));

  const onInputContainerLayout = (event: LayoutChangeEvent) => {
    if (inputWidthAlreadyAdjusted.current) {
      return;
    }

    inputWidth.value = event.nativeEvent.layout.width;
    inputWidthAlreadyAdjusted.current = true;
  };

  const onAnimateTransition = () => {
    if (!goBackAnimations) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }

    webViewOpacity.value = withTiming(0, ANIMATION_CONFIG);
    webViewTranslateY.value = withTiming(screenHeight, ANIMATION_CONFIG);

    buttonOpacity.value = withTiming(0, ANIMATION_CONFIG);

    placeholderTranslateX.value = withTiming(goBackAnimations.inputContentXShift, ANIMATION_CONFIG);

    noSearchViewOpacity.value = withTiming(0, ANIMATION_CONFIG);

    inputWidth.value = withTiming(goBackAnimations.inputTargetWidth, ANIMATION_CONFIG);
    inputFlex.value = 0;
    inputTranslateX.value = withTiming(goBackAnimations.inputXShift, ANIMATION_CONFIG);
    inputTranslateY.value = withTiming(goBackAnimations.inputYShift, ANIMATION_CONFIG, () => {
      runOnJS(onExitBrowser)();
    });
  };

  return (
    <BrowserAnimationContext.Provider
      value={{
        inputRef,
        shouldRunAnimations: goBackAnimations !== undefined,
        animatedContentStyle,
        animatedInputStyle,
        animatedPlaceholderStyle,
        animatedButtonStyle,
        animatedWebViewStyle,
        noSearchViewStyle,
        onAnimateTransition,
        onInputContainerLayout,
      }}>
      {children}
    </BrowserAnimationContext.Provider>
  );
};

export const useBrowserAnimationContext = (): BrowserAnimationContextValue => {
  const context = useContext(BrowserAnimationContext);

  if (!context) {
    throw new Error('BrowserAnimationContext not initialized');
  }

  return context;
};
