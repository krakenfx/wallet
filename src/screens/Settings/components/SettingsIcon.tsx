import { StyleSheet, View } from 'react-native';

import type { IconName, SvgIconProps } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { type ColorName, useTheme } from '@/theme/themes';

interface Props<T extends IconName> {
  name: T;
  isWarningIcon?: boolean;
  color?: SvgIconProps['color'];
  backgroundColor?: ColorName;
}

export const SettingsIcon = <T extends IconName>({ name, isWarningIcon, color, backgroundColor }: Props<T>) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (isWarningIcon) {
      return colors.red400_15;
    }

    if (backgroundColor) {
      return colors[backgroundColor];
    }

    return colors.light15;
  };

  const getIconColor = () => {
    if (isWarningIcon) {
      return 'red400';
    }

    if (color) {
      return color;
    }

    return undefined;
  };

  return (
    <View style={[styles.icon, { backgroundColor: getBackgroundColor() }]}>
      <SvgIcon name={name} color={getIconColor()} />
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
