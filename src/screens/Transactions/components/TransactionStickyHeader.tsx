import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { AnimateStyle } from 'react-native-reanimated';

import format from 'date-fns/format';
import { StyleSheet, View } from 'react-native';

import { TransactionHeader } from '@/components/Transaction';
import { TRANSACTION_PENDING_TYPES, TRANSACTION_TYPES } from '@/realm/transactions/const';

import { useTransactionContext } from '../context/TransactionContext';
import { getHeaderNameFromParsedTransaction } from '../utils/getHeaderNameFromParsedTransaction';

interface StickyHeaderProps {
  collapsibleSectionStyle: StyleProp<AnimateStyle<StyleProp<ViewStyle>>>;
}

export const TransactionStickyHeader: React.FC<StickyHeaderProps> = ({ collapsibleSectionStyle }) => {
  return (
    <View style={styles.container}>
      <TransactionStickyHeaderContent collapsibleSectionStyle={collapsibleSectionStyle} />
    </View>
  );
};

interface TransactionStickyHeaderContentProps {
  collapsibleSectionStyle: StyleProp<AnimateStyle<StyleProp<ViewStyle>>>;
}

const TransactionStickyHeaderContent: React.FC<TransactionStickyHeaderContentProps> = ({ collapsibleSectionStyle }) => {
  const { transaction, parsedTransaction, pendingTransaction, transactionDetailsMetadata } = useTransactionContext();
  const badge = parsedTransaction && 'status' in parsedTransaction && parsedTransaction.status === 'failed' ? 'failed' : undefined;

  switch (transactionDetailsMetadata.transactionType) {
    case TRANSACTION_TYPES.NFT_BUY:
    case TRANSACTION_TYPES.NFT_MINT:
    case TRANSACTION_TYPES.NFT_SELL: {
      return (
        <TransactionHeader
          collapsibleSectionStyle={collapsibleSectionStyle}
          useFallbackIcon
          name={getHeaderNameFromParsedTransaction(parsedTransaction)}
          heading={transactionDetailsMetadata.title}
          date={formatTransactionTime(transaction.time)}
          badge={badge}
        />
      );
    }
    case TRANSACTION_TYPES.NFT_SEND:
    case TRANSACTION_TYPES.NFT_RECEIVE: {
      return <TransactionHeader heading={transactionDetailsMetadata.title} date={formatTransactionTime(transaction.time)} badge={badge} />;
    }

    case TRANSACTION_PENDING_TYPES.SEND:
    case TRANSACTION_PENDING_TYPES.RECEIVE: {
      return (
        <TransactionHeader
          heading={transactionDetailsMetadata.title}
          date={
            pendingTransaction?.isValid() && pendingTransaction.time !== null
              ? format(new Date(pendingTransaction.time * 1000), 'd LLLL yyyy・h:mmaaa')
              : undefined
          }
          badge={(badge ?? (pendingTransaction?.isValid() && pendingTransaction)) ? 'pending' : undefined}
        />
      );
    }

    case TRANSACTION_TYPES.SEND:
    case TRANSACTION_TYPES.RECEIVE: {
      return <TransactionHeader heading={transactionDetailsMetadata.title} date={formatTransactionTime(transaction.time)} badge={badge} />;
    }

    case TRANSACTION_TYPES.SWAP: {
      return (
        <TransactionHeader
          collapsibleSectionStyle={collapsibleSectionStyle}
          useFallbackIcon
          name={getHeaderNameFromParsedTransaction(parsedTransaction)}
          heading={transactionDetailsMetadata.title}
          date={formatTransactionTime(transaction.time)}
          badge={badge}
        />
      );
    }

    case TRANSACTION_TYPES.TOKEN_APPROVAL: {
      return (
        <TransactionHeader
          collapsibleSectionStyle={collapsibleSectionStyle}
          useFallbackIcon
          name={getHeaderNameFromParsedTransaction(parsedTransaction)}
          heading={transactionDetailsMetadata.title}
          date={formatTransactionTime(transaction.time)}
          badge={badge}
        />
      );
    }

    case TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED: {
      return (
        <TransactionHeader
          collapsibleSectionStyle={collapsibleSectionStyle}
          useFallbackIcon
          name={getHeaderNameFromParsedTransaction(parsedTransaction)}
          heading={transactionDetailsMetadata.title}
          date={formatTransactionTime(transaction.time)}
          badge={badge}
        />
      );
    }

    case TRANSACTION_TYPES.CONTRACT_INTERACTION: {
      return (
        <TransactionHeader
          collapsibleSectionStyle={collapsibleSectionStyle}
          useFallbackIcon
          name={getHeaderNameFromParsedTransaction(parsedTransaction)}
          heading={transactionDetailsMetadata.title}
          date={formatTransactionTime(transaction.time)}
          badge={badge}
        />
      );
    }

    case TRANSACTION_TYPES.DEPOSIT: {
      return (
        <TransactionHeader
          collapsibleSectionStyle={collapsibleSectionStyle}
          useFallbackIcon
          name={getHeaderNameFromParsedTransaction(parsedTransaction)}
          heading={transactionDetailsMetadata.title}
          date={formatTransactionTime(transaction.time)}
          badge={badge}
        />
      );
    }

    default: {
      return <TransactionHeader heading={transactionDetailsMetadata.title} date={formatTransactionTime(transaction.time)} badge={badge} />;
    }
  }
};

function formatTransactionTime(transactionTime: number | null) {
  if (transactionTime === null) {
    return undefined;
  }

  return format(new Date(transactionTime * 1000), 'd LLLL yyyy・h:mmaaa');
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
});
