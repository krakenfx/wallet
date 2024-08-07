import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg from 'react-native-svg';

import { WalletType } from '@/onChain/wallets/registry';

import { getNetworkIcon } from '/generated/networkIcons';

type Props = {
  networkName: WalletType | 'walletTypeUnknown';
  size: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export const NetworkIcon = ({ networkName, size = 40, style, testID }: Props) => {
  const stylesHook = useMemo(
    () =>
      StyleSheet.create({
        ball: {
          width: size,
          height: size,
        },
      }),
    [size],
  );

  const NetworkIconSvg = useMemo(() => {
    return getNetworkIcon(networkName) ?? (() => null);
  }, [networkName]);

  return (
    <View style={[styles.ball, stylesHook.ball, style]} testID={testID}>
      <Svg viewBox="0 0 250 250" width={size} height={size}>
        <NetworkIconSvg />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '60%',
    height: '60%',
  },
});
