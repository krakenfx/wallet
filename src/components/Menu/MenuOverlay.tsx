import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, Platform, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import Animated, { WithSpringConfig, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMenu } from '@/components/Menu/MenuProvider';
import { useTheme } from '@/theme/themes';
import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { ContextMenu, ContextMenuProps } from './ContextMenu';
import { DropdownMenu, DropdownMenuProps } from './DropdownMenu';

export type PositionProps = {
  origin: {
    x: number;
    y: number;
    elementHeight: number;
  };
  menuWidth?: number;
};

export type PopupMenuProps<T> = (ContextMenuProps & { type: 'context' }) | (DropdownMenuProps<T> & { type: 'dropdown' });
export type MenuOverlayProps<T = any> = PopupMenuProps<T> & PositionProps;

const springConfig: WithSpringConfig = {
  mass: 1,
  stiffness: 200,
  damping: 18,
};

export const MenuOverlay: React.FC<MenuOverlayProps<any>> = ({ origin, menuWidth, ...props }) => {
  const [layout, setLayout] = useState<LayoutRectangle>();
  const { height, width } = useWindowDimensions();
  const { hide } = useMenu();
  const { colors } = useTheme();
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const alignTo = origin.x < width / 2 ? 'left' : 'right';
  const transition = useSharedValue(0);

  useEffect(() => {
    transition.value = withSpring(1, springConfig);
  }, [transition]);

  const onClose = () => {
    transition.value = withSpring(0, springConfig, finished => {
      if (finished) {
        runOnJS(hide)();
      }
    });
  };

  useAndroidBackButton(() => {
    onClose();
    return true;
  });

  const maxMenuHeight = useMemo(() => {
    if (origin.y - origin.elementHeight / 2 > height / 2) {
      return origin.y - insets.top - origin.elementHeight;
    } else {
      return height - origin.y - Platform.select({ ios: insets.bottom, default: 0 }) - 16;
    }
  }, [height, insets.bottom, insets.top, origin.y, origin.elementHeight]);

  const horizontalPositionStyle = alignTo === 'left' ? { left: 0 } : { right: 0 };

  const onLayout = (e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout);

  const animatedStyle = useAnimatedStyle(() => {
    if (!layout) {
      return { opacity: 0 };
    }

    const maxBottom = frame.height - insets.bottom;
    const bottom = layout.height + layout.y;

    const translateOriginX = (layout.width / 2) * (alignTo === 'left' ? -1 : 1);
    const translateOriginY = layout.height / -2;

    const additionalOffset = bottom > maxBottom ? -layout.height - origin.elementHeight : 0;

    return {
      transform: [
        { translateY: translateOriginY },
        { translateX: translateOriginX },
        { scale: interpolate(transition.value, [0, 1], [0.5, 1]) },
        { translateX: -translateOriginX },
        { translateY: -translateOriginY },
        { translateY: additionalOffset },
      ],
      opacity: interpolate(transition.value, [0, 1], [0, 1]),
    };
  }, [layout]);

  return (
    <TouchableWithoutFeedback style={{ ...StyleSheet.absoluteFillObject }} onPress={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          testID="MenuOverlay"
          onLayout={onLayout}
          style={[
            styles.modalContent,
            !!menuWidth && { width: menuWidth },
            Platform.OS === 'android' && styles.modalAndroid,
            horizontalPositionStyle,
            { maxHeight: maxMenuHeight, top: origin.y },
            animatedStyle,
          ]}>
          <View style={[styles.blurBackground, { backgroundColor: Platform.select({ ios: colors.background, default: colors.androidDarkBlurBg }) }]} />
          <BlurView blurAmount={60} blurType={'dark'} style={styles.blur}>
            {props.type === 'context' ? <ContextMenu {...props} onClose={onClose} /> : <DropdownMenu {...props} onClose={onClose} />}
          </BlurView>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    position: 'absolute',
    width: 284,
    borderRadius: 16,
    marginHorizontal: 24,
    flex: 1,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowRadius: 36,
  },
  modalAndroid: {
    overflow: 'hidden',
    elevation: 16,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    opacity: 0.3,
  },
  blur: {
    borderRadius: 16,
  },
});
