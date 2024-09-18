import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FeeOptionKind } from '@/api/types';
import { AddressDisplay } from '@/components/AddressDisplay';

import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';

import { TransactionDetailItem } from '@/components/Transaction';

import { WalletType } from '@/onChain/wallets/registry';
import { getWalletName } from '@/utils/getWalletName';

import { Amounts, TransactionParams } from '../types';
import { BTCfeeOptionToString } from '../utils/BTCfeeOptionToString';
import { feeOptionToString } from '../utils/feeOptionToString';

import loc from '/loc';

interface DetailsProps {
  transactionParams: TransactionParams;
  recipientLabel: string;
  walletType: WalletType;
  selectedFee?: FeeOptionKind;
  amounts: Amounts | null;
}

export const Details: React.FC<DetailsProps> = ({ transactionParams, amounts, recipientLabel, walletType, selectedFee }) => {
  return (
    <View style={styles.detailsContainer}>
      {transactionParams.type !== 'nft' && (
        <TransactionDetailItem title={loc.transactionDetails.amount}>
          <Label>
            {`${transactionParams.amount} ${transactionParams.token.metadata.symbol} `}
            <Label type="regularMonospace" color="light75">
              -{amounts?.amountFiat}
            </Label>
          </Label>
        </TransactionDetailItem>
      )}

      <TransactionDetailItem title={loc.transactionDetails.recipient}>
        <AddressDisplay
          address={transactionParams.address}
          ensName={recipientLabel !== transactionParams.address ? recipientLabel : undefined}
          hasSpaces
          boldPrefix
        />
      </TransactionDetailItem>

      <TransactionDetailItem title={loc.formatString(loc.transactionDetails.networkFee, { network: getWalletName(walletType) })}>
        <View style={styles.feeContainer}>
          <NetworkIcon networkName={walletType} size={16} />
          <Label>
            {selectedFee ? (walletType === 'HDsegwitBech32' ? BTCfeeOptionToString(selectedFee) : feeOptionToString(selectedFee)) : ''} - {amounts?.feeFiat}
          </Label>
        </View>
      </TransactionDetailItem>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 8,
  },
  feeContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
