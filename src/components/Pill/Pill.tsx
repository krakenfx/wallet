import type { PropsWithChildren } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

type Props = {
  backgroundColor: ColorName;
  overrideStyles?: StyleProp<ViewStyle>;
} & PropsWithChildren;

export const Pill = ({ children, backgroundColor, overrideStyles }: Props) => {
  const { colors } = useTheme();

  return <View style={[styles.pillContainer, { backgroundColor: colors[backgroundColor] }, overrideStyles]}>{children}</View>;
};

const styles = StyleSheet.create({
  pillContainer: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
