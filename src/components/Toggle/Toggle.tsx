import type { StyleProp, ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';

import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { type ColorName, useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

interface BaseToggleProps {
  leftText: string;
  rightText?: string;
  leftTestID?: string;
  rightTestID?: string;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  toggleStyle?: StyleProp<ViewStyle>;
  backgroundColor?: ColorName;
  sliderColor?: ColorName;
  handleTap?: () => void;
  disabled?: boolean;
  initiallySelected?: boolean;
}
interface ControlledToggleProps extends BaseToggleProps {
  animation: SharedValue<number>;
  onTap: () => void;
}

interface ToggleProps extends BaseToggleProps {
  onChange: (rightValue: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ onChange, initiallySelected, ...props }) => {
  const selected = useSharedValue(initiallySelected ? 1 : 0);

  const onTap = () => {
    onChange(!selected.value);
    hapticFeedback.impactLight();
    selected.value = withTiming(selected.value ? 0 : 1);
  };

  return <ControlledToggle {...props} onTap={onTap} animation={selected} />;
};

export const ControlledToggle = React.memo(
  ({
    animation,
    leftText,
    testID,
    leftTestID,
    rightTestID,
    rightText,
    toggleStyle,
    onTap,
    sliderColor = 'kraken',
    backgroundColor = 'light15',
    containerStyle,
    disabled,
    handleTap,
  }: ControlledToggleProps) => {
    const { colors } = useTheme();
    const leftWidth = useSharedValue(0);
    const rightWidth = useSharedValue(0);

    const style = useAnimatedStyle(() => {
      return {
        width: interpolate(animation.value, [0, 1], [leftWidth.value, rightWidth.value], { extrapolateRight: Extrapolation.CLAMP }),
        left: interpolate(animation.value, [0, 1], [0, leftWidth.value], {
          extrapolateRight: Extrapolation.CLAMP,
          extrapolateLeft: Extrapolation.CLAMP,
        }),
      };
    });

    return (
      <View style={[styles.toggleWrapper, containerStyle]}>
        <TouchableWithoutFeedback onPress={handleTap ?? onTap} disabled={disabled && !handleTap} testID={testID}>
          <Animated.View style={[styles.container, toggleStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors[backgroundColor] }, disabled && styles.disabled, toggleStyle]} />
            <Animated.View style={[style, styles.slider, { backgroundColor: colors[sliderColor] }]} />
            <View style={styles.itemWrapper} onLayout={e => (leftWidth.value = e.nativeEvent.layout.width)}>
              <Label testID={leftTestID}>{leftText}</Label>
            </View>
            <View style={[styles.itemWrapper, disabled && styles.disabled]} onLayout={e => (rightWidth.value = e.nativeEvent.layout.width)}>
              <Label testID={rightTestID}>{rightText}</Label>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  toggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    borderRadius: 100,
    alignItems: 'center',
    height: 40,
    overflow: 'hidden',
  },
  itemWrapper: {
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  slider: {
    position: 'absolute',
    height: '100%',
    borderRadius: 100,
  },
});
