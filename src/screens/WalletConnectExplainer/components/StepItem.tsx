import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Label } from '@/components/Label';
import type { LabelProps } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import type { IconName } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

export type StepItemProps = {
  text: string;
  textProps?: LabelProps;
  circleElement: React.ReactElement;
  icon?: IconName;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  circleStyle?: StyleProp<ViewStyle>;
};

export const StepItem: React.FC<StepItemProps> = ({ circleElement, text, textProps, icon, style, circleStyle }) => {
  const theme = useTheme();

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={[styles.circle, { backgroundColor: theme.colors.kraken }, circleStyle]}>{circleElement}</View>
      <Label type="regularTitle1" color="light75" {...textProps}>
        {text}
      </Label>
      {icon && <SvgIcon size={24} style={styles.icon} name={icon} color="light75" />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 6,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
