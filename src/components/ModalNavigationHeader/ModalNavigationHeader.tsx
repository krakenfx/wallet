import type { ReactElement } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { CloseButtonProps } from '@/components/CloseButton';
import { CloseButton } from '@/components/CloseButton';
import { Label } from '@/components/Label';

export interface ModalNavigationHeader {
  title?: string | ReactElement;
  goBackOnly?: boolean;
  onClosePress?: CloseButtonProps['onPress'];
  style?: StyleProp<ViewStyle>;
}

export const ModalNavigationHeader = ({ title, goBackOnly, onClosePress, style }: ModalNavigationHeader) => {
  return (
    <View>
      <View style={[styles.wrapper, style]}>
        {typeof title === 'string' ? <Label type="boldTitle1">{title}</Label> : title}
        <CloseButton goBackOnly={goBackOnly} onPress={onClosePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
});
