import type { SharedValue, WithSpringConfig } from 'react-native-reanimated';

import React, { useCallback, useImperativeHandle, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { SizeAwareSVGUri } from '@/components/SizeAwareSVGUri';

import type { TransitionConfig } from '../NftImageGalleryScreen';

export type NftImageGalleryItemProps = {
  uri: string;
  onClose: () => void;
  controlsVisibility: SharedValue<number>;
  initialScaleType?: 'cover' | 'contain';
  imageSize: {
    width: number;
    height: number;
  };
  isSvg?: boolean;
  transitionConfig: TransitionConfig;
  transitionValues: {
    screenExit: SharedValue<number>;
    panDismiss: SharedValue<number>;
    screenExitOrPanDismiss: SharedValue<number>;
  };
};

export type NftImageGalleryItemRef = {
  dismissGallery: () => void;
};

const DISMISS_OFFSET_THRESHOLD = 50;
const DISMISS_OFFSET_MAX = 200;
const MAX_ZOOM_SCALE = 3;
const MAX_SVG_SCALE = 2;

export enum PanDismiss {
  NONE = 0,
  BEGIN = 1,
  END = 2,
  FINISHED = 3,
}

const dismissAnimationConfig: WithSpringConfig = {
  damping: 15,
  overshootClamping: true,
  mass: 1.2,
  restSpeedThreshold: 1,
};

export const NftImageGalleryItem = React.forwardRef<NftImageGalleryItemRef, NftImageGalleryItemProps>(
  ({ uri, imageSize, isSvg, transitionValues, transitionConfig, initialScaleType = 'contain', controlsVisibility, onClose }, ref) => {
    const dimensions = useSafeAreaFrame();

    const { width, height } = useMemo(
      () =>
        !isSvg
          ? imageSize
          : {
              width: imageSize.width * MAX_SVG_SCALE,
              height: imageSize.height * MAX_SVG_SCALE,
            },
      [imageSize, isSvg],
    );

    const scaleInfo = useMemo(() => {
      const scaleX = dimensions.width / width;
      const scaleY = dimensions.height / height;

      const scaleContain = Math.min(scaleX, scaleY);
      const scaleCover = Math.max(scaleX, scaleY);
      const scaleFullSize = 1;

      return {
        scaleX,
        scaleY,
        scaleContain,
        scaleCover,
        scaleFullSize,
      };
    }, [dimensions.width, dimensions.height, width, height]);

    const translateY = useSharedValue(0);
    const translateYOffset = useSharedValue(0);

    const translateX = useSharedValue(0);
    const translateXOffset = useSharedValue(0);

    const initialScale = initialScaleType === 'contain' ? scaleInfo.scaleContain : scaleInfo.scaleCover;
    const zoomOutDismissThreshold = 0.9 * initialScale;
    const scale = useSharedValue(initialScale);
    const scaleOffset = useSharedValue(initialScale);

    const { panDismiss, screenExit, screenExitOrPanDismiss } = transitionValues;

    useAnimatedReaction(
      () => {
        if (scale.value !== initialScale) {
          if (scale.value < initialScale) {
            return interpolate(scale.value, [zoomOutDismissThreshold, initialScale], [PanDismiss.END, PanDismiss.NONE], Extrapolate.CLAMP);
          }
          return 0;
        }
        if (panDismiss.value === PanDismiss.FINISHED) {
          return panDismiss.value;
        }
        const offset = Math.max(Math.abs(translateX.value), Math.abs(translateY.value));
        return interpolate(offset, [0, DISMISS_OFFSET_THRESHOLD, DISMISS_OFFSET_MAX], [PanDismiss.NONE, PanDismiss.BEGIN, PanDismiss.END], Extrapolate.CLAMP);
      },
      newPanDismiss => (panDismiss.value = newPanDismiss),
    );

    const toggleControls = useCallback(
      (toVisible: boolean) => {
        'worklet';
        controlsVisibility.value = withTiming(toVisible ? 1 : 0);
      },
      [controlsVisibility],
    );

    const dismissGallery = useCallback(() => {
      'worklet';
      toggleControls(false);
      translateX.value = withSpring(0, dismissAnimationConfig);
      translateY.value = withSpring(0, dismissAnimationConfig);
      scale.value = withSpring(initialScale, dismissAnimationConfig);
      screenExit.value = withSpring(1, dismissAnimationConfig, finished => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
    }, [initialScale, onClose, scale, toggleControls, screenExit, translateX, translateY]);

    useImperativeHandle(ref, () => ({ dismissGallery }), [dismissGallery]);

    const pinch = Gesture.Pinch()
      .onStart(() => {
        scaleOffset.value = scale.value;
        toggleControls(false);
      })
      .onUpdate(event => {
        scale.value = scaleOffset.value * event.scale;
      })
      .onEnd(() => {
        if (scale.value > MAX_ZOOM_SCALE) {
          scale.value = withTiming(MAX_ZOOM_SCALE);
        }
        if (scale.value < zoomOutDismissThreshold) {
          panDismiss.value = withTiming(PanDismiss.FINISHED);
          dismissGallery();
        } else if (scale.value < initialScale) {
          scale.value = withTiming(initialScale);
        }
      });

    const pan = Gesture.Pan()
      .onStart(() => {
        translateXOffset.value = translateX.value;
        translateYOffset.value = translateY.value;
        toggleControls(false);
      })
      .onUpdate(event => {
        translateX.value = translateXOffset.value + event.translationX;
        translateY.value = translateYOffset.value + event.translationY;
      })
      .onEnd(event => {
        if (scale.value === scaleInfo.scaleContain) {
          const offset = Math.max(Math.abs(event.translationX), Math.abs(event.translationY));
          if (offset > DISMISS_OFFSET_THRESHOLD) {
            panDismiss.value = withTiming(PanDismiss.FINISHED);
            dismissGallery();
            return;
          }

          translateY.value = withTiming(0);
          translateX.value = withTiming(0);
        } else {
          const newTranslateX = translateXOffset.value + event.translationX;
          const scaledImageWidth = width * scale.value;

          const maxTranslateX = scaledImageWidth <= dimensions.width ? 0 : (scaledImageWidth - dimensions.width) / 2;
          const minTranslateX = -maxTranslateX;

          if (newTranslateX > maxTranslateX) {
            translateX.value = withTiming(maxTranslateX);
          } else if (newTranslateX < minTranslateX) {
            translateX.value = withTiming(minTranslateX);
          } else {
            translateX.value = withDecay({
              velocity: event.velocityX,
              clamp: [minTranslateX, maxTranslateX],
            });
          }

          const newTranslateY = translateYOffset.value + event.translationY;
          const realImageHeight = height * scale.value;
          const maxTranslateY = realImageHeight <= dimensions.height ? 0 : (realImageHeight - dimensions.height) / 2;
          const minTranslateY = -maxTranslateY;

          if (newTranslateY > maxTranslateY) {
            translateY.value = withTiming(maxTranslateY);
          } else if (newTranslateY < minTranslateY) {
            translateY.value = withTiming(minTranslateY);
          } else {
            translateY.value = withDecay({
              velocity: event.velocityY,
              clamp: [minTranslateY, maxTranslateY],
            });
          }
        }
      });

    const tap = Gesture.Tap().onEnd(() => {
      toggleControls(!controlsVisibility.value);
    });

    const doubleTap = Gesture.Tap()
      .onStart(() => {
        toggleControls(false);
        if (scale.value === scaleInfo.scaleContain) {
          scale.value = withTiming(scaleInfo.scaleCover);
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
        } else {
          scale.value = withTiming(scaleInfo.scaleContain);
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
        }
      })
      .numberOfTaps(2);

    const animatedPanStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    const animatedScaleStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },

        {
          scale: interpolate(panDismiss.value, [PanDismiss.NONE, PanDismiss.BEGIN, PanDismiss.END], [1, 1, transitionConfig.dismissScale ?? 1]),
        },
      ],
    }));

    const borderRadiusStyle = useAnimatedStyle(() => {
      const { borderRadius } = transitionConfig;
      if (!borderRadius) {
        return {};
      }
      return {
        borderRadius: interpolate(screenExitOrPanDismiss.value, [0, 1], [0, borderRadius / initialScale], Extrapolate.CLAMP),
      };
    }, [transitionConfig.borderRadius, scaleInfo]);

    const gestures = Gesture.Exclusive(Gesture.Simultaneous(pan, pinch), doubleTap, tap);

    return (
      <GestureDetector gesture={gestures}>
        <Animated.View style={styles.container}>
          <Animated.View style={animatedPanStyle}>
            {isSvg ? (
              <Animated.View style={[styles.svgImageContainer, animatedScaleStyle, { width, height }, borderRadiusStyle]}>
                <SizeAwareSVGUri style={styles.svg} uri={uri} fillContainer />
              </Animated.View>
            ) : (
              <Animated.View style={[animatedScaleStyle, styles.svg, { width, height }, borderRadiusStyle]}>
                <FastImage style={StyleSheet.absoluteFill} source={{ uri }} targetOriginalSize />
              </Animated.View>
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    overflow: 'hidden',
  },
  svgImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
