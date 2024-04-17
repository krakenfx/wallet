import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

interface Props {
  sign: string;
}

export const CurrencyIcon = ({ sign }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.icon, { backgroundColor: colors.light15 }]}>
      <Label type="boldTitle1">{sign}</Label>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 100,
    height: 40,
    width: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
