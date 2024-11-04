import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';

import { Label } from '@/components/Label';

import { useTheme } from '@/theme/themes';

import loc from '/loc';

export const LoadingBlock: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.purple_20 }]}>
      <ActivityIndicator />
      <Label type="boldTitle2" color="light75">
        {loc.swap.findingBestRote}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
});
