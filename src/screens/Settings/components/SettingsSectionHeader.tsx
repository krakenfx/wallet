import React from 'react';
import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';

export const SettingsSectionHeader = ({ title }: { title: string }) => (
  <Label type="boldTitle2" color="light50" style={styles.sectionHeader}>
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
