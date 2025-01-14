import type React from 'react';

import { StyleSheet } from 'react-native';

import { Input, type InputProps } from '@/components/Input';
import { Label } from '@/components/Label';

import { useTheme } from '@/theme/themes';

export const SlippageSettingsInput: React.FC<InputProps> = props => {
  const { colors } = useTheme();
  return (
    <Input
      type="boldLargeMonospace"
      keyboardType="numeric"
      style={styles.inputWrapper}
      placeholderTextColor="kraken"
      containerStyle={styles.inputContainer}
      inputStyle={[styles.input, { color: colors.light75 }]}
      right={<Label color={props.value ? 'light75' : 'light50'}>%</Label>}
      borderColorOnFocus="kraken"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 34,
    paddingVertical: 0,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 16,
    maxWidth: 100,
  },
  inputWrapper: {
    paddingVertical: 0,
    borderRadius: 12,
  },
});
