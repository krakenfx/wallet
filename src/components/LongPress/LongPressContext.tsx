import type { PropsWithChildren } from 'react';

import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

import { noop } from 'lodash';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useGlobalState } from '@/components/GlobalState';
import type { LongPressOptionItemProps } from '@/components/LongPress/LongPressOptionItem';
import { useDeviceSize } from '@/hooks/useDeviceSize';

type PressOutCallback = () => void;

type AnimatedViewStyle = StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;

interface LongPressProps {
  selectedItem: React.ReactNode;
  onLongPress: (item: React.ReactNode, positionX: number, positionY: number, onPressOutCallback?: PressOutCallback) => void;
  onPressOut: (skipAnimation?: boolean, callback?: PressOutCallback) => void;
  animatedStyle: AnimatedViewStyle;
  animatedOptionsStyle: AnimatedViewStyle;
  overlayStyle: AnimatedViewStyle;
  styles: AnimatedViewStyle;
  setStyles: (style: AnimatedViewStyle) => void;
  setOptions: (options: LongPressOptionItemProps[]) => void;
  options: LongPressOptionItemProps[];
}

const LongPressContext = createContext<LongPressProps>({
  selectedItem: null,
  onLongPress: noop,
  onPressOut: noop,
  animatedStyle: {},
  animatedOptionsStyle: {},
  overlayStyle: {},
  styles: {},
  options: [],
  setStyles: noop,
  setOptions: noop,
});

const TOP_DISTANCE_STANDARD = 150;
const TOP_DISTANCE_SMALL = 80;
const TOP_DISTANCE_BIG = 200;
const DURATION = 250;
const ADDITIONAL_SCALE_DURATION = 100;
const INITIAL_OPACITY = 0.3;
const INITIAL_OPTIONS_SCALE = 0;
const DELAY_OPACITY_OUT = 200;
const MARGIN_X = 12 + 12;
const END_SCALE = 1.02;

export const LongPressProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<React.ReactNode>();
  const [styles, setStyles] = useState<AnimatedViewStyle>({});
  const [options, setOptions] = useState<LongPressOptionItemProps[]>([]);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(INITIAL_OPACITY);
  const top = useSharedValue(0);
  const left = useSharedValue(0);
  const optionsScale = useSharedValue(INITIAL_OPTIONS_SCALE);
  const { size } = useDeviceSize();
  const topDistance = useMemo(() => {
    switch (size) {
      case 'small':
        return TOP_DISTANCE_SMALL;
      case 'big':
        return TOP_DISTANCE_BIG;
      default:
        return TOP_DISTANCE_STANDARD;
    }
  }, [size]);
  const pressOutCallback = useRef<PressOutCallback>();
  const [, setShowNavTabs] = useGlobalState('showNavTabs');

  const onLongPress = (item: React.ReactNode, positionX: number, positionY: number, onPressOutCallback?: () => void) => {
    top.value = positionY;
    left.value = positionX;

    if (onPressOutCallback) {
      pressOutCallback.current = onPressOutCallback;
    }

    setSelectedItem(item);

    opacity.value = withTiming(1, { duration: DURATION });

    scale.value = withTiming(END_SCALE, { duration: DURATION + ADDITIONAL_SCALE_DURATION, easing: Easing.inOut(Easing.linear) }, () => {
      translateY.value = withTiming(-(positionY - topDistance), {
        duration: DURATION,
        easing: Easing.inOut(Easing.cubic),
      });
      optionsScale.value = withTiming(1, { duration: DURATION });
      if (positionX !== 0) {
        translateX.value = withTiming(-positionX + MARGIN_X, {
          duration: DURATION,
          easing: Easing.inOut(Easing.cubic),
        });
      }
    });

    setShowNavTabs(false);
  };

  const onPressOut = (skipAnimation?: boolean, callback?: PressOutCallback) => {
    setShowNavTabs(true);

    if (pressOutCallback.current) {
      pressOutCallback.current();
      pressOutCallback.current = undefined;
    }
    if (skipAnimation) {
      opacity.value = withTiming(INITIAL_OPACITY, { duration: DURATION }, () => {
        runOnJS(setSelectedItem)(null);
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        optionsScale.value = INITIAL_OPTIONS_SCALE;
        callback && runOnJS(callback)();
      });

      return;
    }

    translateY.value = withTiming(
      0,
      {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      },
      () => {
        runOnJS(setSelectedItem)(null);
        callback && runOnJS(callback)();
      },
    );

    scale.value = withTiming(1, { duration: DURATION });
    translateX.value = withTiming(0, { duration: DURATION, easing: Easing.inOut(Easing.ease) });
    optionsScale.value = withTiming(INITIAL_OPTIONS_SCALE, { duration: DURATION, easing: Easing.inOut(Easing.ease) });
    opacity.value = withTiming(INITIAL_OPACITY, { duration: DURATION + DELAY_OPACITY_OUT });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }, { translateX: translateX.value }],
      top: top.value,
      left: left.value,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedOptionsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: optionsScale.value }],
      opacity: optionsScale.value,
      left: left.value ? -MARGIN_X : 0,
    };
  });

  return (
    <LongPressContext.Provider
      value={{
        selectedItem,
        onLongPress,
        onPressOut,
        animatedStyle,
        overlayStyle,
        styles,
        setStyles,
        animatedOptionsStyle,
        setOptions,
        options,
      }}>
      {children}
    </LongPressContext.Provider>
  );
};

export const useLongPress = () => useContext(LongPressContext);
