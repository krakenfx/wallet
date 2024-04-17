import React from 'react';
import { Platform, StyleSheet, TextInputProps } from 'react-native';

import { Input, InputProps } from './Input';
import { SvgIcon } from './SvgIcon';

interface SearchInputProps extends InputProps {
  placeholder?: string;
  style?: TextInputProps['style'];
  onChangeText?: TextInputProps['onChangeText'];
  testID?: string;
}

export const SearchInput = ({ style, ...props }: SearchInputProps) => {
  return (
    <Input
      left={<SvgIcon name="search" size={18} color="light75" style={styles.icon} />}
      style={[styles.input, style]}
      inputStyle={styles.inputComponent}
      inputWrapperStyle={styles.inputWrapper}
      containerStyle={styles.container}
      autoCorrect={false}
      spellCheck={false}
      returnKeyType="search"
      clearButtonMode="while-editing"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: 48,
  },
  inputWrapper: {
    height: 48,
  },
  input: {
    paddingVertical: 0,
  },
  inputComponent: {
    lineHeight: 20,
    marginTop: Platform.select({ android: 2 }),
  },
  icon: {
    marginRight: 8,
  },
});
