import React from 'react';

import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button, ButtonProps } from '@/components/Button';
import { Label } from '@/components/Label';

import loc from '/loc';

interface Props {
  onSendPress: () => unknown;
  onReceivePress: () => unknown;
  style?: StyleProp<ViewStyle>;
}

export const SendReceiveButtons = ({ onReceivePress, onSendPress, style }: Props) => {
  const renderButton = (label: string, btnProps: ButtonProps) => {
    return (
      <View style={styles.btnContainer}>
        <Button color="purple_40" style={styles.btn} {...btnProps} />
        <Label type="boldCaption1" color="light50" style={styles.label}>
          {label}
        </Label>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, style]} entering={FadeIn}>
      {renderButton(loc.universalSend.buttonTitle, { icon: 'send', onPress: onSendPress, testID: 'UniversalSendBtn' })}
      {renderButton(loc.universalReceive.buttonTitle, { icon: 'receive', onPress: onReceivePress, testID: 'UniversalReceiveBtn' })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  btnContainer: {
    flex: 1,
    gap: 2,
  },
  btn: {
    height: 58,
  },
  label: {
    textAlign: 'center',
  },
});
