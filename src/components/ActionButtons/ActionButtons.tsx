import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { ButtonProps } from '@/components/Button';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

import { useDeviceSize } from '@/hooks/useDeviceSize';

import loc from '/loc';

interface Props {
  onSendPress: () => unknown;
  onReceivePress: () => unknown;
  onSwapPress?: () => unknown;
  canSwap: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ActionButtons = ({ onReceivePress, onSendPress, canSwap, onSwapPress, style }: Props) => {
  const { size } = useDeviceSize();
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
    <Animated.View style={[styles.container, style, size === 'small' && styles.smallDeviceContainer]} entering={FadeIn}>
      {renderButton(loc.universalSend.buttonTitle, { icon: 'send', onPress: onSendPress, testID: 'UniversalSendBtn' })}
      {renderButton(loc.universalReceive.buttonTitle, { icon: 'receive', onPress: onReceivePress, testID: 'UniversalReceiveBtn' })}
      {canSwap && renderButton(loc.swap.buttonTitle, { icon: 'swap', onPress: onSwapPress, testID: 'UniversalSwapBtn' })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  smallDeviceContainer: {
    marginTop: 16,
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
