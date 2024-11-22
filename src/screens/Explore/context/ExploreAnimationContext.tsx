import type { ViewStyle } from 'react-native';

import type { AnimatedRef } from 'react-native-reanimated';

import { useFocusEffect } from '@react-navigation/native';
import React, { type PropsWithChildren, useCallback, useContext } from 'react';

import { useWindowDimensions } from 'react-native';

import { Easing, measure, runOnJS, runOnUI, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBrowser } from '@/hooks/useBrowser';
import type { BrowserParams } from '@/screens/Browser';

import { isInAppBrowserEnabled } from '@/utils/featureFlags';

import { Sizes, TRANSITION_DURATION } from '../ExploreScreen.constants';

interface ExploreAnimationContextProps {
  animateScreenUnmount: () => void;
}

interface ExploreAnimationContextValue {
  searchBarContainerRef: AnimatedRef<React.Component>;
  searchBarContentRef: AnimatedRef<React.Component>;
  searchBarAnimatedContainerStyle: ViewStyle;
  searchBarAnimatedContentStyle: ViewStyle;
  openLinkWithTransition: (url?: string) => void;
}

interface Measurements {
  containerPageY: number;
  contentWidth: number;
}

const ExploreAnimationContext = React.createContext<ExploreAnimationContextValue | undefined>(undefined);

const TRANSITION_CONFIG = {
  duration: TRANSITION_DURATION,
  easing: Easing.inOut(Easing.linear),
};

const WIDTH_REDUCTION = 18;
const LEFT_SHIFT = -12;

export const ExploreAnimationContextProvider: React.FC<PropsWithChildren<ExploreAnimationContextProps>> = ({ animateScreenUnmount, children }) => {
  const insets = useSafeAreaInsets();
  const { openURL, openWithoutURL } = useBrowser();
  const { width: screenWidth } = useWindowDimensions();

  const searchBarContainerRef = useAnimatedRef();
  const searchBarContentRef = useAnimatedRef();

  const translateContentX = useSharedValue(0);
  const searchBarContainerX = useSharedValue(0);
  const searchBarContainerY = useSharedValue(0);

  const containerWidth = useSharedValue(screenWidth - Sizes.Space.s2 * 2);

  const searchBarAnimatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchBarContainerX.value }, { translateY: searchBarContainerY.value }],
    width: containerWidth.value,
  }));

  const searchBarAnimatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateContentX.value }],
  }));

  const measureView = (): Promise<Measurements | null> => {
    return new Promise(resolve => {
      runOnUI(() => {
        const containerMeasurements = measure(searchBarContainerRef);
        const contentMeasurements = measure(searchBarContentRef);

        if (!containerMeasurements || !contentMeasurements) {
          runOnJS(resolve)(null);
          return;
        }

        runOnJS(resolve)({
          containerPageY: containerMeasurements.pageY,
          contentWidth: contentMeasurements.width,
        });
      })();
    });
  };

  const openLinkWithTransition = async (url?: string) => {
    const measurements = await measureView();

    if (!isInAppBrowserEnabled() || !measurements) {
      if (url) {
        openURL(url);
      } else {
        openWithoutURL();
      }

      return;
    }

    animateScreenUnmount();

    const contentXShift = url ? (screenWidth / 0.6) * -1 : Sizes.Space.s2 + 4 - (containerWidth.value - measurements.contentWidth) / 2;
    translateContentX.value = withTiming(contentXShift, TRANSITION_CONFIG);

    const containerYShift = insets.top + 5 - measurements.containerPageY;

    const inputTargetWidth = containerWidth.value;
    containerWidth.value = withTiming(containerWidth.value - WIDTH_REDUCTION, TRANSITION_CONFIG);
    searchBarContainerX.value = withTiming(LEFT_SHIFT, TRANSITION_CONFIG);
    searchBarContainerY.value = withTiming(containerYShift, TRANSITION_CONFIG, () => {
      const params = {
        customTransitionAnimation: 'fade',
        goBackAnimations: {
          inputXShift: LEFT_SHIFT * -1,
          inputYShift: containerYShift * -1,
          inputTargetWidth,
          inputContentXShift: contentXShift * -1 + 9,
        },
      } satisfies BrowserParams;

      if (url) {
        runOnJS(openURL)(url, params);
      } else {
        runOnJS(openWithoutURL)(params);
      }
    });
  };

  useFocusEffect(
    useCallback(
      () => {
        searchBarContainerX.value = 0;
        searchBarContainerY.value = 0;
        containerWidth.value = screenWidth - Sizes.Space.s2 * 2;
        translateContentX.value = 0;
      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  );

  return (
    <ExploreAnimationContext.Provider
      value={{
        searchBarContainerRef,
        searchBarContentRef,
        searchBarAnimatedContainerStyle,
        searchBarAnimatedContentStyle,
        openLinkWithTransition,
      }}>
      {children}
    </ExploreAnimationContext.Provider>
  );
};

export const useExploreAnimationContext = (): ExploreAnimationContextValue => {
  const context = useContext(ExploreAnimationContext);

  if (!context) {
    throw new Error('ExploreAnimationContext not initialized');
  }

  return context;
};
