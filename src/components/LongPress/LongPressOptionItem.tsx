import React from 'react';
import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

export interface LongPressOptionItemProps {
  text: string | string[];
  iconName: IconName;
  onPress?: () => void;
  spaceBelow?: boolean;
}

export const LongPressOptionItem = ({ text, onPress, iconName, spaceBelow }: LongPressOptionItemProps) => {
  const { colors } = useTheme();
  return (
    <Touchable
      style={[styles.container, { backgroundColor: colors.dark50 }, spaceBelow && { ...styles.border, borderBottomColor: colors.dark15 }]}
      onPress={onPress}>
      <Label type="boldBody">{text}</Label>
      <SvgIcon name={iconName} size={24} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  first: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  border: {
    borderBottomWidth: 6,
  },
});
