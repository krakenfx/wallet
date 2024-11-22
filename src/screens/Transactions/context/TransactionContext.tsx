import React, { type PropsWithChildren } from 'react';

import { useContext } from 'react';

import type { Transaction } from '@/api/types';
import type { BTCTransaction } from '@/onChain/wallets/bitcoin';

import type { AssetMetadata } from '@/realm/assetMetadata';
import type { NftMetadata } from '@/realm/nftMetadata';
import type { usePendingTransactionById, useTransactionById } from '@/realm/transactions';
import type { TRANSACTION_PENDING_TYPES, TRANSACTION_TYPES } from '@/realm/transactions/const';

export type TransactionDetailsType = {
  title: string;
  description: string;
  networkFee?: string | null;
  appCurrencyValue: string;
  tokenAmount: string;
  symbol?: string;
  transactionType?: TRANSACTION_TYPES | TRANSACTION_PENDING_TYPES;
  swapMetadata?: { sent: AssetMetadata; receive: AssetMetadata };
  isNft?: boolean;
  nftMetadata?: NftMetadata;
  pendingMetadata?: {
    to: string;
    from: string;
  };
};

type ExistingTransaction = ReturnType<typeof useTransactionById>;
type PendingTransaction = ReturnType<typeof usePendingTransactionById>;

interface TransactionContextProps {
  existingTransaction: ExistingTransaction;
  pendingTransaction: PendingTransaction;
  transaction: NonNullable<ExistingTransaction | PendingTransaction>;
  parsedTransaction: Transaction | BTCTransaction | undefined;
  transactionWalletAddress: string;
  transactionDetailsMetadata: TransactionDetailsType;
}

const TransactionContext = React.createContext<TransactionContextProps | undefined>(undefined);

export const TransactionContextProvider: React.FC<PropsWithChildren<TransactionContextProps>> = ({
  existingTransaction,
  pendingTransaction,
  transaction,
  parsedTransaction,
  transactionWalletAddress,
  transactionDetailsMetadata,
  children,
}) => {
  return (
    <TransactionContext.Provider
      value={{
        existingTransaction,
        pendingTransaction,
        transaction,
        parsedTransaction,
        transactionWalletAddress,
        transactionDetailsMetadata,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = (): TransactionContextProps => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error('TransactionContext not initialized');
  }

  return context;
};
