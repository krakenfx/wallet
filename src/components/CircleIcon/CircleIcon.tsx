import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { type IconName, SvgIcon, type SvgIconProps } from '@/components/SvgIcon';
import { type ColorName, useTheme } from '@/theme/themes';

interface IconInCircle {
  name: IconName;
  size?: number;
  iconSize?: number;
  iconColor?: SvgIconProps['color'];
  backgroundColor?: ColorName;
  style?: StyleProp<ViewStyle>;
}

export const CircleIcon = ({ name, backgroundColor = 'green500', iconColor = 'light100', size = 40, iconSize = 24, style }: IconInCircle) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.icon, { backgroundColor: colors[backgroundColor], width: size, height: size }, style]}>
      <SvgIcon size={iconSize} name={name} color={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
