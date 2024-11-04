import type { FC } from 'react';

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { DataLossWarning } from '@/screens/Settings/passwordProtection/DataLossWarning';

interface Props {
  onClosePress: () => void;
  onResetApp: () => void;
}

export const DataLossWarningScreen: FC<Props> = ({ onResetApp, onClosePress }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { top: insets.top + (StatusBar.currentHeight ?? 0) }]}>
      <IconButton name="chevron-left" size={20} onPress={onClosePress} testID="GoBackButton" style={styles.back} />
      <DataLossWarning onResetApp={onResetApp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  back: {
    left: 16,
    marginBottom: 24,
  },
});
