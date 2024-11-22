import type React from 'react';

import { StyleSheet, View, type ViewProps } from 'react-native';

import { type ColorName, useTheme } from '@/theme/themes';

interface Props extends ViewProps {
  color?: ColorName;
}

export const DividerLine: React.FC<Props> = ({ style, color = 'light8', ...props }) => {
  const { colors } = useTheme();

  return <View style={[styles.line, { backgroundColor: colors[color] }, style]} {...props} />;
};

const styles = StyleSheet.create({
  line: {
    height: 1,
  },
});
