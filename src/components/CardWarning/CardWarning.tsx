import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Button } from '@/components/Button';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

import { IconName, SvgIcon } from '@/components/SvgIcon';
import { Touchable, TouchableProps } from '@/components/Touchable';
import { ColorName, useTheme } from '@/theme/themes';
import { Warning } from '@/types';

export type CardWarningProps = TouchableProps & {
  buttonText?: string;
  description: string;
  numberOfLines?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string;
  type: 'normal' | 'warning' | 'negative' | 'info';
  elementRight?: React.ReactElement;
  iconSize?: number;
  hideLeftIcon?: boolean;
};

type CardWarningColors = Record<'backgroundColor' | 'buttonBackgroundColor' | 'textColor' | 'headerTextColor' | 'iconColor', ColorName>;

const COLORS: Record<CardWarningProps['type'], CardWarningColors> = {
  normal: {
    backgroundColor: 'transparent',
    buttonBackgroundColor: 'light15',
    headerTextColor: 'light100',
    textColor: 'light75',
    iconColor: 'light75',
  },
  info: {
    backgroundColor: 'light8',
    buttonBackgroundColor: 'light15',
    headerTextColor: 'light100',
    textColor: 'light100',
    iconColor: 'yellow500',
  },
  warning: {
    backgroundColor: 'red400_15',
    buttonBackgroundColor: 'yellow500_15',
    headerTextColor: 'yellow500',
    textColor: 'yellow500',
    iconColor: 'yellow500',
  },
  negative: {
    backgroundColor: 'red400_15',
    buttonBackgroundColor: 'red400_15',
    headerTextColor: 'red400',
    textColor: 'red400',
    iconColor: 'red400',
  },
};

const ICONS: Record<'warning' | 'negative' | 'info', IconName> = {
  warning: 'error',
  negative: 'warning-filled',
  info: 'warning',
};

export const CardWarning = React.memo(
  ({
    title = '',
    description = '',
    buttonText = '',
    numberOfLines,
    onPress,
    type,
    style,
    iconSize,
    elementRight,
    hideLeftIcon,
    ...touchableProps
  }: CardWarningProps) => {
    const theme = useTheme();

    const { backgroundColor, buttonBackgroundColor, textColor, headerTextColor, iconColor } = COLORS[type];

    return (
      <Touchable
        onPress={onPress}
        activeOpacity={onPress ? 0.85 : 1}
        style={[{ backgroundColor: theme.colors[backgroundColor] }, styles.card, style, !title && styles.cardSmall]}
        {...touchableProps}>
        {type === 'normal' && <GradientItemBackground />}
        <View style={[styles.row, !title && styles.singleRow]}>
          {type !== 'normal' && !hideLeftIcon && (
            <SvgIcon name={ICONS[type]} size={iconSize} color={iconColor} style={[styles.icon, ICONS[type] === 'warning' && styles.warningIcon]} />
          )}
          <View style={styles.column}>
            {title && (
              <Label type="boldTitle2" color={headerTextColor} style={styles.title}>
                {title}
              </Label>
            )}
            <Label type="regularCaption1" color={textColor} style={styles.desc} numberOfLines={numberOfLines ?? 0} ellipsizeMode="tail">
              {description}
            </Label>
            {onPress && buttonText ? (
              <View style={styles.buttonRow}>
                <Button color={buttonBackgroundColor} textColor={textColor} size="small" text={buttonText} onPress={onPress} disabled={false} />
              </View>
            ) : null}
          </View>
          {elementRight}
        </View>
      </Touchable>
    );
  },
);

export const CardWarningFromWarning = ({ warning }: { warning: Warning }) => {
  return (
    <CardWarning title={warning.heading} description={warning.message} type={warning.severity === 'critical' ? 'negative' : 'warning'} numberOfLines={4} />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 16,
    overflow: 'hidden',
  },
  cardSmall: {
    paddingVertical: 12,
  },
  icon: {
    marginRight: 6,
  },
  row: {
    flexDirection: 'row',
  },
  singleRow: {
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  desc: {
    lineHeight: 20,
  },
  warningIcon: {
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
