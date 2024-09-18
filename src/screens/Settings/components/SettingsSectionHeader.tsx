import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import { Label } from '@/components/Label';

export const SettingsSectionHeader = ({ title, style }: { title: string; style?: StyleProp<TextStyle> }) => (
  <Label type="boldTitle2" color="light50" style={[styles.sectionHeader, style]}>
    {title}
  </Label>
);

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 40,
    marginBottom: 16,
    paddingLeft: 12,
  },
});
