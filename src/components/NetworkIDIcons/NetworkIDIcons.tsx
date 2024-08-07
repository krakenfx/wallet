import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { NetworkIcon } from '@/components/NetworkIcon';
import { WalletType } from '@/onChain/wallets/registry';

import { getNetworkName } from '/modules/wallet-connect/utils';

type Props = {
  networkIDs: string[];
  align: 'left' | 'right';
  containerStyle?: StyleProp<ViewStyle>;
};

export const NetworkIDIcons = ({ networkIDs, align, containerStyle }: Props) => {
  const coinTypes = networkIDs.map(networkID => getNetworkName(networkID)).filter(Boolean) as WalletType[];

  return (
    <View style={[styles.container, { maxWidth: coinTypes.length * 16 - (coinTypes.length - 1) * 6 }, containerStyle]}>
      {coinTypes.map((coinType, i) => {
        const style = align === 'left' ? [i !== 0 && { left: -6 * i }] : [i !== coinTypes.length - 1 && { left: 6 * (coinTypes.length - i - 1) }];

        return <NetworkIcon size={16} networkName={coinType} style={style} key={coinType + '' + i} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
