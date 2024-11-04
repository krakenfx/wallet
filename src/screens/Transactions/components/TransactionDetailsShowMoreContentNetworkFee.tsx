import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { LabeledField } from '@/components/LabeledField';
import type { NativeTokenSymbol } from '@/onChain/wallets/base';

import { useTransactionDetailsNetworkFee } from '../utils/useTransactionDetailsNetworkFee';

import loc from '/loc';

type Props = {
  assetId: string;
  nativeTokenDecimals: number;
  nativeTokenSymbol: NativeTokenSymbol;
  networkFee?: string | null;
};

export const TransactionDetailsShowMoreContentNetworkFee = ({ assetId, nativeTokenDecimals, nativeTokenSymbol, networkFee }: Props) => {
  const { amount, price } = useTransactionDetailsNetworkFee({ assetId, nativeTokenDecimals, nativeTokenSymbol, networkFee });

  return amount ? (
    <LabeledField label={loc.transactionDetails.genericNetworkFee}>
      <View style={styles.networkFee}>
        <Label testID="TxDetailsNetworkFeeAmount">{amount}</Label>
        {price && (
          <Label testID="TxDetailsNetworkFeePrice" type="regularLargeMonospace" color="light75" style={styles.networkFeePrice}>
            {' ' + price}
          </Label>
        )}
      </View>
    </LabeledField>
  ) : null;
};

const styles = StyleSheet.create({
  networkFee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkFeePrice: {
    fontSize: 15,
  },
});
