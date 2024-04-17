import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { TickIcon } from '@/screens/Settings/components/index';

interface SettingsCheckItemProps {
  name: string;
  enabled: boolean;
  onPress?: () => void;
}

export const SettingsCheckItem = ({ name, enabled, onPress }: SettingsCheckItemProps) => (
  <Touchable disabled={!onPress} onPress={onPress}>
    <View style={styles.lockItem}>
      <Label color="light50">{name}</Label>
      <TickIcon enabled={enabled} />
    </View>
  </Touchable>
);

const styles = StyleSheet.create({
  lockItem: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
