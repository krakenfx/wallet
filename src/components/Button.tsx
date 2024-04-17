import { omit, upperFirst } from 'lodash';
import React from 'react';
import { AccessibilityProps, StyleSheet, View } from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ColorName, useTheme } from '@/theme/themes';

import { ActivityIndicator } from './ActivityIndicator';
import { Label, TypographyKey } from './Label';
import { IconName, SvgIcon } from './SvgIcon';
import { Touchable, TouchableProps } from './Touchable';

export type ButtonSize = 'small' | 'medium' | 'large' | 'extraLarge';

export const EXTRA_LARGE_BUTTON_SIZE = 64;
export const LARGE_BUTTON_SIZE = 64;
export const MEDIUM_BUTTON_SIZE = 36;
export const SMALL_BUTTON_SIZE = 28;

export type ButtonProps = TouchableProps & {
  testID?: string;
  testIDModifier?: 'positive' | 'negative';
  color?: ColorName;
  textColor?: ColorName;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  disabledOpacity?: number;
} & AccessibilityProps &
  (
    | {
        text: string | string[];
        textType?: TypographyKey;
        icon?: IconName;
        iconSize?: number;
        iconRight?: boolean;
        iconAbove?: boolean;
        iconColor?: ColorName;
      }
    | { icon: IconName; iconSize?: number; iconRight?: boolean; iconAbove?: boolean; iconColor?: ColorName }
  );

export const Button = React.memo(
  ({
    color = 'light15',
    disabled,
    loading,
    loadingText,
    onPress,
    size = 'small',
    style,
    testID,
    textColor = 'light100',
    testIDModifier,
    disabledOpacity = 0.25,
    ...props
  }: ButtonProps) => {
    const theme = useTheme();

    let content: React.ReactNode = null;
    const textType: TypographyKey =
      ('textType' in props ? props.textType : undefined) || (size === 'small' ? 'boldCaption1' : size === 'large' ? 'boldTitle2' : 'boldTitle2');

    if (loading) {
      content = loadingText ? (
        <View style={styles.row}>
          <ActivityIndicator />
          <Label style={styles.loadingText} type={textType}>
            {loadingText}
          </Label>
        </View>
      ) : (
        <ActivityIndicator />
      );
    } else {
      content = (
        <View style={[styles.row, props.iconRight && { flexDirection: 'row-reverse' }, props.iconAbove && { flexDirection: 'column' }]}>
          {props.icon && <SvgIcon name={props.icon} size={props.iconSize} color={props.iconColor} />}
          {'text' in props && (
            <Label type={textType} color={textColor} style={[size === 'small' && styles.smallText]}>
              {props.text}
            </Label>
          )}
        </View>
      );
    }

    const fullTestID = `${testID}${upperFirst(testIDModifier)}`;

    const backgroundStyle = useAnimatedStyle(() => ({
      backgroundColor: withTiming(theme.colors[color]),
    }));

    return (
      <Touchable
        hitSlop={6}
        onPress={onPress}
        style={[styles.button, styles[size], backgroundStyle, { opacity: disabled ? disabledOpacity : undefined }, style]}
        accessibilityRole="button"
        accessibilityLabel={'text' in props ? (Array.isArray(props.text) ? props.text.join('') : props.text) : undefined}
        disabled={disabled || loading}
        testID={fullTestID}
        {...omit(props, 'text', 'icon')}>
        {content}
      </Touchable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    minHeight: SMALL_BUTTON_SIZE,
    paddingVertical: 4,
  },
  medium: {
    minHeight: MEDIUM_BUTTON_SIZE,
  },
  large: {
    minHeight: LARGE_BUTTON_SIZE,
  },
  extraLarge: {
    minHeight: EXTRA_LARGE_BUTTON_SIZE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 4,
  },
  loadingText: {
    marginLeft: 8,
  },
  smallText: {
    lineHeight: 17,
  },
});
