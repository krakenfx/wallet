import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import type { WalletType } from '@/onChain/wallets/registry';

import loc from '/loc';

type Props = {
  detached?: boolean;
  networkName: WalletType | 'walletTypeUnknown';
  networkFee: string;
  networkFeeInCurrency: string;
};

export const NetworkFee = ({ detached, networkFee, networkFeeInCurrency, networkName }: Props) => {
  const networkFeeFormatted = networkFee ? `-${networkFee}` : '';
  const networkFeeInCurrencyFormatted = networkFeeInCurrency ? `(-${networkFeeInCurrency})` : '';

  return (
    <View style={[styles.container, detached && styles.detached]}>
      <GradientItemBackground backgroundType="modal" />
      <View style={styles.networkFee}>
        <NetworkIcon networkName={networkName} size={16} />
        <Label type="boldBody" numberOfLines={1} style={styles.networkFeeLabel}>
          {loc.transactionDetails.genericNetworkFee}
        </Label>
      </View>
      <View style={styles.networkFeeAmounts}>
        <Label type="regularCaption1" color="light75" adjustsFontSizeToFit numberOfLines={1}>
          {networkFeeFormatted}
        </Label>
        <Label type="regularCaption1" color="light50">
          {networkFeeInCurrencyFormatted}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    padding: 16,
    overflow: 'hidden',
  },
  detached: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  networkFee: {
    flexDirection: 'row',
    flexShrink: 2,
    alignItems: 'center',
    gap: 6,
  },
  networkFeeAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  networkFeeLabel: {
    flexShrink: 2,
  },
});
