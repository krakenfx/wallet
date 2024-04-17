import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/themes';

export const CriticalWarningBackground = () => {
  const { colors } = useTheme();

  return <View style={[StyleSheet.absoluteFill, styles.background, { backgroundColor: colors.red500 }]} />;
};

const styles = StyleSheet.create({
  background: {
    opacity: 0.22,
  },
});
