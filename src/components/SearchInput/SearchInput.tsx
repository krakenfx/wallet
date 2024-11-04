import type { StyleProp, TextInputProps, TextStyle } from 'react-native';

import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import type { InputProps } from '@/components/Input';
import { Input } from '@/components/Input';
import { SvgIcon } from '@/components/SvgIcon';

interface SearchInputProps extends InputProps {
  placeholder?: string;
  style?: TextInputProps['style'];
  inputWrapperStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<TextStyle>;
  onChangeText?: TextInputProps['onChangeText'];
  testID?: string;
}

export const SearchInput = ({ style, inputWrapperStyle, inputContainerStyle, ...props }: SearchInputProps) => {
  return (
    <Input
      left={<SvgIcon name="search" size={18} color="light75" style={styles.icon} />}
      style={[styles.input, style]}
      inputStyle={styles.inputComponent}
      inputWrapperStyle={[styles.inputWrapper, inputWrapperStyle]}
      containerStyle={[styles.container, inputContainerStyle]}
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
