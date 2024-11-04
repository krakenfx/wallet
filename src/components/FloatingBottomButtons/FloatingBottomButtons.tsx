import React from 'react';
import { StyleSheet } from 'react-native';

import type { ButtonProps } from '@/components/Button';
import { Button } from '@/components/Button';
import type { FloatingBottomContainerProps } from '@/components/FloatingBottomContainer';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';

export interface FloatingBottomButtonsProps extends FloatingBottomContainerProps {
  primary: ButtonProps;
  secondary?: ButtonProps;
}

export const FloatingBottomButtons: React.FC<FloatingBottomButtonsProps> = ({ primary, secondary, style, ...otherProps }) => {
  return (
    <FloatingBottomContainer style={[styles.buttonContainer, style]} {...otherProps}>
      {secondary ? <Button size="large" {...secondary} style={[styles.buttonSecondary, secondary.style]} /> : null}
      <Button size="large" {...primary} color={primary.color ?? 'kraken'} style={[styles.buttonPrimary, primary.style]} />
    </FloatingBottomContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    flex: 1,
  },
  buttonSecondary: {
    flex: 1,
    marginRight: 8,
  },
});
