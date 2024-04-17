import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/themes';

import { Label } from './Label';
import { SvgIcon } from './SvgIcon';
import { Touchable } from './Touchable';

type Props = {
  checked: boolean;
  title?: string;
  onPress: () => void;
  testID?: string;
};

export const CheckBox = ({ checked, title, onPress, testID }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Touchable testID={testID} onPress={onPress} style={[styles.checkbox, { borderColor: colors.light15 }, checked && { backgroundColor: colors.kraken }]}>
        {checked && <SvgIcon name="checkmark" size={20} />}
      </Touchable>
      {title && (
        <Label type="regularCaption1" color="light75" style={styles.label}>
          {title}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  checkbox: {
    marginTop: 4,
    marginRight: 16,
    borderRadius: 4,
    width: 24,
    height: 24,
    borderWidth: 1,
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    lineHeight: 20,
  },
});
