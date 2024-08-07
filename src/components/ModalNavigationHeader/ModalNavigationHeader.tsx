import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { CloseButton, CloseButtonProps } from '@/components/CloseButton';
import { Label } from '@/components/Label';

export interface ModalNavigationHeader {
  title?: string | ReactElement;
  goBackOnly?: boolean;
  onClosePress?: CloseButtonProps['onPress'];
  showHandle?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ModalNavigationHeader = ({ title, goBackOnly, onClosePress, showHandle, style }: ModalNavigationHeader) => {
  return (
    <View>
      {showHandle && <View style={styles.handle} />}
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
  handle: {
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 4,
  },
});
