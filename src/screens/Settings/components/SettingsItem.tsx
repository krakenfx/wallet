import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import type { IconName, SvgIconProps } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';

import type { ColorName } from '@/theme/themes';

import { SettingsIcon } from '../components';

interface SettingsItemProps {
  title: string;
  label?: string;
  icon?: IconName;
  iconColor?: SvgIconProps['color'];
  iconBackgroundColor?: ColorName;
  onPress: () => void;
  testID?: string;
  isFirst?: boolean;
  isLast?: boolean;
  isHighlighted?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  isWarningAction?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SettingsItem = ({
  icon,
  title,
  label,
  onPress,
  testID,
  isLast,
  isFirst,
  isHighlighted,
  children,
  footer,
  isWarningAction,
  containerStyle,
  iconColor,
  iconBackgroundColor,
}: SettingsItemProps) => {
  const borderTopRadius = isFirst ? { borderTopLeftRadius: 16, borderTopRightRadius: 16 } : {};
  const borderBottomRadius = isLast ? { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 } : {};

  const borderRadiusStyle: StyleProp<ViewStyle> = [borderTopRadius, borderBottomRadius];

  return (
    <Touchable style={[styles.container, borderRadiusStyle, containerStyle]} onPress={onPress} testID={testID}>
      {isHighlighted && <GradientItemBackground />}
      {icon ? (
        <>
          <SettingsIcon name={icon} isWarningIcon={isWarningAction} color={iconColor} backgroundColor={iconBackgroundColor} />
        </>
      ) : (
        <>
          <View style={styles.spaceElement} />
        </>
      )}
      <View style={styles.values}>
        <Label type="boldTitle2" color={isWarningAction ? 'red400' : undefined}>
          {title}
        </Label>
        {!!label && (
          <Label style={styles.label} type="regularCaption1" color="light75">
            {label}
          </Label>
        )}
      </View>
      <View style={styles.rightElement}>
        {children}
        <SvgIcon name="chevron-right" size={16} style={styles.chevron} color={!isWarningAction ? 'light75' : 'red400'} />
      </View>
      {footer}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    padding: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  values: {
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
  },
  label: {
    marginTop: 2,
  },
  spaceElement: {
    marginRight: 12,
  },
  rightElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 6,
  },
});
