import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { StyleSheet } from 'react-native';

import NameResolver from '@/api/NameResolver';
import { Transaction } from '@/api/types';
import { Button } from '@/components/Button';
import { ExpandableSheet } from '@/components/Sheets';
import { BTCTransaction } from '@/onChain/wallets/bitcoin';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { memoizedJSONParseTx, usePendingTransactionById, useTransactionById } from '@/realm/transactions';
import { RealmWallet } from '@/realm/wallets';
import { NavigationProps } from '@/Routes';

import { navigationStyle } from '@/utils/navigationStyle';

import { TransactionDetails } from './components/TransactionDetails';
import { TransactionShowMoreContent } from './components/TransactionShowMoreContent';
import { TransactionStickyHeader } from './components/TransactionStickyHeader';
import { TransactionContextProvider, TransactionDetailsType } from './context/TransactionContext';
import { openExplorer } from './utils/openExplorer';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TransactionDetailsParams = {
  id: string;
  assetId?: string;
  transactionDetailsData: TransactionDetailsType;
};

export const TransactionDetailsScreen = ({ route, navigation }: NavigationProps<'TransactionDetails'>) => {
  const existingTransaction = useTransactionById(route.params.id);
  const pendingTransaction = usePendingTransactionById(route.params.id);
  const transaction = existingTransaction || pendingTransaction;

  const [transactionWalletAddress, setTransactionWalletAddress] = useState('');

  useEffect(() => {
    async function fetchAndSetTransacttionWalletAddress() {
      const txWalletAddress = await fetchTransactionWalletAddress(transaction.wallet);
      setTransactionWalletAddress(txWalletAddress);
    }

    fetchAndSetTransacttionWalletAddress();
  }, [transaction.wallet]);

  const parsedTransaction: Transaction | BTCTransaction | undefined = useMemo(() => {
    try {
      if ('data' in transaction) {
        return memoizedJSONParseTx(transaction.data ?? '{}');
      }
      return undefined;
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    }

    return undefined;
  }, [transaction]);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onOpenExplorer = () => openExplorer(transaction.wallet.type, transaction.transactionId);

  if (!transaction?.isValid()) {
    return null;
  }

  return (
    <TransactionContextProvider
      transactionDetailsMetadata={route.params.transactionDetailsData}
      transaction={transaction}
      existingTransaction={existingTransaction}
      pendingTransaction={pendingTransaction}
      transactionWalletAddress={transactionWalletAddress}
      parsedTransaction={parsedTransaction}>
      <ExpandableSheet
        dismissible
        onDismiss={navigateBack}
        StickyHeaderComponent={TransactionStickyHeader}
        PreviewComponent={<TransactionDetails assetId={route.params.assetId} />}
        DetailsComponent={<TransactionShowMoreContent navigation={navigation} />}
        FloatingButtonsComponent={
          <Button
            size="large"
            text={loc.transactionDetails.openExplorer}
            testID="TxDetailsViewInExplorerButton"
            onPress={onOpenExplorer}
            color="kraken"
            style={styles.viewInExplorerButton}
          />
        }
      />
    </TransactionContextProvider>
  );
};

async function fetchTransactionWalletAddress(wallet: RealmWallet) {
  const { network } = getImplForWallet(wallet);

  const nameResolver = new NameResolver(network);
  const transactionWalletAddress = await network.deriveAddress(wallet);

  if (!nameResolver.isNetworkSupported()) {
    return transactionWalletAddress;
  }

  try {
    const address = await nameResolver.resolveAddress(transactionWalletAddress);
    return address || transactionWalletAddress;
  } catch {
    return transactionWalletAddress;
  }
}

const styles = StyleSheet.create({
  viewInExplorerButton: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
});

TransactionDetailsScreen.navigationOptions = navigationStyle({
  headerShown: false,
  animation: 'none',
  presentation: 'transparentModal',
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
