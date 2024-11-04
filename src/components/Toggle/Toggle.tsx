import type { StyleProp, ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';

import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

interface BaseToggleProps {
  leftText: string;
  rightText?: string;
  leftTestID?: string;
  rightTestID?: string;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  toggleStyle?: StyleProp<ViewStyle>;
  handleTap?: () => void;
  disabled?: boolean;
}
interface ControlledToggleProps extends BaseToggleProps {
  animation: SharedValue<number>;
  onTap: () => void;
}

interface ToggleProps extends BaseToggleProps {
  onChange: (rightValue: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ onChange, ...props }) => {
  const selected = useSharedValue(0);

  const onTap = () => {
    onChange(!selected.value);
    hapticFeedback.impactLight();
    selected.value = withTiming(selected.value ? 0 : 1);
  };

  return <ControlledToggle {...props} onTap={onTap} animation={selected} />;
};

export const ControlledToggle = React.memo(
  ({ animation, leftText, testID, leftTestID, rightTestID, rightText, toggleStyle, onTap, containerStyle, disabled, handleTap }: ControlledToggleProps) => {
    const { colors } = useTheme();
    const leftWidth = useSharedValue(0);
    const rightWidth = useSharedValue(0);

    const style = useAnimatedStyle(() => {
      return {
        width: interpolate(animation.value, [0, 1], [leftWidth.value, rightWidth.value], { extrapolateRight: Extrapolate.CLAMP }),
        left: interpolate(animation.value, [0, 1], [0, leftWidth.value], { extrapolateRight: Extrapolate.CLAMP, extrapolateLeft: Extrapolate.CLAMP }),
      };
    });

    return (
      <View style={[styles.toggleWrapper, containerStyle]}>
        <TouchableWithoutFeedback onPress={handleTap ?? onTap} disabled={disabled && !handleTap} testID={testID}>
          <Animated.View style={[styles.container, toggleStyle]}>
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.light15 }, disabled && styles.disabled, toggleStyle]} />
            <Animated.View style={[style, styles.slider, { backgroundColor: colors.kraken }]} />
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
