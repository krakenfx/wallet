import format from 'date-fns/format';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AddressDisplay } from '@/components/AddressDisplay';
import { CopyToClipBoard } from '@/components/CopyToClipboard';
import { Label } from '@/components/Label';
import { LabeledField } from '@/components/LabeledField';
import { getImplForWallet } from '@/onChain/wallets/registry';

import type { NavigationProps } from '@/Routes';

import { useTransactionContext } from '../context/TransactionContext';

import { AddressesAndDescription } from './AddressAndDescription';
import { TransactionDetailsShowMoreContentNetworkFee } from './TransactionDetailsShowMoreContentNetworkFee';

import loc from '/loc';

export const TransactionShowMoreContent: React.FC<Pick<NavigationProps<'TransactionDetails'>, 'navigation'>> = ({ navigation }) => {
  const { transaction, parsedTransaction, pendingTransaction, existingTransaction, transactionDetailsMetadata } = useTransactionContext();
  const { network } = getImplForWallet(transaction.wallet);

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        {!!pendingTransaction?.isValid() && !existingTransaction && (
          <LabeledField label={loc.transactionDetails.status}>
            <Label testID="TxDetailsStatus">{loc.transactionDetails.state.pending}</Label>
          </LabeledField>
        )}

        {transaction.time && (
          <LabeledField label={loc.transactionDetails.time}>
            {}
            <Label testID="TxDetailsTime">{format(new Date(transaction.time * 1000), "d LLLL yyyy 'at' h:mm aa")}</Label>
          </LabeledField>
        )}

        <AddressesAndDescription navigation={navigation} />

        <LabeledField label={loc.transactionDetails.transaction_id}>
          <CopyToClipBoard stringToCopy={transaction.transactionId}>
            <Label testID="TxDetailsId">{transaction.transactionId}</Label>
          </CopyToClipBoard>
        </LabeledField>

        <TransactionDetailsShowMoreContentNetworkFee
          assetId={network.nativeTokenCaipId}
          nativeTokenDecimals={network.nativeTokenDecimals}
          nativeTokenSymbol={network.nativeTokenSymbol}
          networkFee={transactionDetailsMetadata.networkFee}
        />

        {parsedTransaction && (
          <>
            {'inputs' in parsedTransaction && (parsedTransaction.inputs as string[]).length && (
              <LabeledField label={loc.transactionDetails.inputs}>
                {(parsedTransaction.inputs as string[]).map((inputAddress: string, i: number) => (
                  <CopyToClipBoard stringToCopy={inputAddress} key={inputAddress + '_input_' + i}>
                    <AddressDisplay address={inputAddress} hasSpaces boldPrefix />
                  </CopyToClipBoard>
                ))}
              </LabeledField>
            )}

            {'outputs' in parsedTransaction && (parsedTransaction.outputs as string[]).length && (
              <LabeledField label={loc.transactionDetails.outputs}>
                {(parsedTransaction.outputs as string[]).map((outputAddress: string, i: number) => (
                  <CopyToClipBoard stringToCopy={outputAddress} key={outputAddress + '_output_' + i}>
                    <AddressDisplay address={outputAddress} hasSpaces boldPrefix style={i > 0 && styles.inputsOutputs} />
                  </CopyToClipBoard>
                ))}
              </LabeledField>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginHorizontal: 24,
    paddingBottom: 150,
  },
  inputsOutputs: {
    paddingTop: 4,
  },
});
