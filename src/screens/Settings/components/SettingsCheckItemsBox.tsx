import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';

export const SettingsCheckItemsBox = ({ children }: PropsWithChildren) => {
  return (
    <View style={[styles.infoBase, styles.lockItemsContainer]}>
      <GradientItemBackground />
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  infoBase: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  lockItemsContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
});
