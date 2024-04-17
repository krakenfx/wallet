import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconWithCoinIcon } from '@/components/IconWithCoinIcon';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';

import loc from '/loc';

type Props = {
  testID: string;
};

const WALLET_CONNECT_NAME = 'WalletConnect';

export const ConnectedAppsEmptyState = ({ testID }: Props) => {
  return (
    <View style={styles.container} testID={testID}>
      <IconWithCoinIcon icon={<SvgIcon name="walletconnect" size={40} />} maskShape="rounded-square" size={76} />
      <Label style={styles.title} type="boldTitle1">
        {WALLET_CONNECT_NAME}
      </Label>
      <Label type="regularBody" color={'light75'} style={styles.instructions}>
        {loc.connectedApps.list.instructions}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
    marginTop: 42,
    maxWidth: 300,
    marginHorizontal: 60,
  },
  icon: {
    top: 2,
  },
  instructions: {
    lineHeight: 22,
    textAlign: 'center',
  },
  title: {
    marginBottom: 8,
    marginTop: 24,
  },
});
