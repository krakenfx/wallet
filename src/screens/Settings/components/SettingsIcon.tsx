import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

interface Props<T extends IconName> {
  name: T;
  isWarningIcon?: boolean;
}

export const SettingsIcon = <T extends IconName>({ name, isWarningIcon }: Props<T>) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.icon, { backgroundColor: !isWarningIcon ? colors.light15 : colors.red400_15 }]}>
      <SvgIcon name={name} color={isWarningIcon ? 'red400' : undefined} />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 100,
    height: 40,
    width: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
