import type { StyleProp, ViewStyle } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FadeOut } from 'react-native-reanimated';

import type { Transaction } from '@/api/types';
import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Label } from '@/components/Label';
import type { NETWORK_FILTER } from '@/components/NetworkFilter/types';
import { omitNetworkIcons } from '@/components/TokenIcon';
import { useRealmQueue } from '@/realm/hooks/useRealmQueue';
import { useFilterInBlacklistedAssets, useFilterInUnverifiedAssets, useLanguage } from '@/realm/settings';
import { useTokenById } from '@/realm/tokens';
import { type RealmPendingTransaction, type RealmTransaction } from '@/realm/transactions';
import { REALM_TYPE_PENDING_TRANSACTION, usePendingNftTransactions, usePendingTransactions, useTransactions } from '@/realm/transactions';
import { getTransactionMetadata } from '@/realm/transactions/getTransactionMetadata';
import { memoizedJSONParseTx } from '@/realm/transactions/utils';
import type { NavigationProps } from '@/Routes';
import { TransactionRowClassifier } from '@/screens/Transactions/components/TransactionRowClassifier';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';
import { groupItemsByDate } from '@/utils/groupItemsByDate';

import { TransactionPendingRow } from '../components/TransactionPendingRow';

import { useIgnoredTransactions } from './useIgnoredTransactions';

import loc from '/loc';

type SectionLabel = {
  type: 'sectionLabel';
  label: string;
};

export type TransactionItem = RealmTransaction | RealmPendingTransaction;
export type TransactionListItem = TransactionItem | SectionLabel;

interface Props {
  tokenId?: string;
  walletId?: string;
  pendingTransactionIds?: string[];
  onPendingTxSucceed?: () => unknown;
  navigation: NavigationProps<'Transactions' | 'GlobalActivity' | 'Home'>['navigation'];
  limit?: number;
  skipTimeHeader?: boolean;
  networkFilter?: NETWORK_FILTER[];
  isRecentActivityView?: boolean;
  pageSize?: number;
}

const isSectionLabel = (item: TransactionListItem): item is SectionLabel => {
  return 'type' in item && item.type === 'sectionLabel';
};

const isPendingTransaction = (item: TransactionItem): item is RealmPendingTransaction => {
  return item.objectSchema().name === REALM_TYPE_PENDING_TRANSACTION;
};

const keyExtractor = (item: TransactionListItem): string => {
  if (isSectionLabel(item)) {
    return item.label;
  }
  if (item.isValid()) {
    return item.transactionId;
  }
  return 'invalid';
};

const getItemType = (item: TransactionListItem): string => {
  if (isSectionLabel(item)) {
    return 'label';
  }
  if (isPendingTransaction(item)) {
    return 'pending';
  }
  const txData = getTransactionMetadata(memoizedJSONParseTx(item.data));
  switch (txData.kind) {
    case 'simple': {
      return omitNetworkIcons[txData.effect.assetId] ? 'simple_noicon' : 'simple';
    }
    default:
      return txData.kind;
  }
};

const dateItemWrapper = (dateFormatted: string): SectionLabel => ({
  type: 'sectionLabel',
  label: dateFormatted,
});

export const useTransactionsDataSource = ({
  tokenId,
  pendingTransactionIds,
  walletId,
  onPendingTxSucceed,
  navigation,
  limit,
  skipTimeHeader,
  networkFilter,
  isRecentActivityView,
  pageSize = 100,
}: Props) => {
  const allPendingTransactions = usePendingTransactions(networkFilter);
  const filterInUnverifiedAssets = useFilterInUnverifiedAssets();
  const filterInBlacklistedAssets = useFilterInBlacklistedAssets();
  const language = useLanguage();
  const [page, setPage] = useState(1);

  const { ignoredIds, onTransactionHide, resetIgnoredIds } = useIgnoredTransactions();

  const pendingTransactionsFromTokenOrGlobal =
    pendingTransactionIds !== undefined ? allPendingTransactions.filtered('id in $0', pendingTransactionIds || []) : allPendingTransactions;
  const token = useTokenById(tokenId);

  const transactions = useTransactions({ assetId: token?.assetId, walletId, networkFilter, ignoredIds });

  const transactionIds = useMemo<string[]>(() => transactions.map(({ id }) => id), [transactions]);
  const transactionTxIds = useMemo<string[]>(() => transactions.map(({ transactionId }) => transactionId), [transactions]);

  const pendingNftTransactions = usePendingNftTransactions(token?.assetId, walletId, networkFilter);

  const { commitRealmTransactionQueue } = useRealmQueue();

  const loadNextPage = useCallback(() => {
    setPage(p => p + 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        commitRealmTransactionQueue(TRANSACTIONS_REALM_QUEUE_KEY);
        resetIgnoredIds();
      };
    }, [commitRealmTransactionQueue, resetIgnoredIds]),
  );

  const pendingTransactions = useMemo(() => {
    const pendingFilteredTransactions = pendingTransactionsFromTokenOrGlobal
      .filtered('NOT id in $0', transactionIds)
      .filtered(
        'additionalStatus != "kraken-connect-to-wallet" OR (additionalStatus == "kraken-connect-to-wallet" AND NOT transactionId IN $0)',
        transactionTxIds,
      );
    return [...(pendingFilteredTransactions ?? []), ...pendingNftTransactions];
  }, [pendingTransactionsFromTokenOrGlobal, transactionIds, transactionTxIds, pendingNftTransactions]);

  const dataSource = useMemo(() => {
    const data: TransactionListItem[] = [];

    let alreadyAddedTransactionCount = 0;

    if (pendingTransactions.length > 0) {
      if (!skipTimeHeader) {
        data.push({
          type: 'sectionLabel',
          label: loc.transactionDetails.state.pending,
        } satisfies SectionLabel);
      }
      const pendingTxs = limit ? pendingTransactions.slice(0, limit) : [...pendingTransactions];

      data.push(...pendingTxs);

      alreadyAddedTransactionCount = pendingTxs.length;
    }

    if (transactions.length > 0) {
      let txs = transactions.slice(0, page * pageSize);
      if (limit) {
        txs = transactions.slice(0, limit - alreadyAddedTransactionCount);
      }

      if (!skipTimeHeader) {
        const itemsWithTimeLabel = groupItemsByDate<RealmTransaction, SectionLabel>(txs, language, dateItemWrapper);

        data.push(...itemsWithTimeLabel);
      } else {
        data.push(...txs);
      }
    }
    return data;
  }, [language, limit, page, pageSize, pendingTransactions, skipTimeHeader, transactions]);

  const renderFooter = useCallback(
    () => (page * pageSize < transactions.length ? <ActivityIndicator style={styles.loadMore} /> : null),
    [page, pageSize, transactions.length],
  );

  const renderTransaction = useCallback(
    (item: RealmTransaction) => {
      const data: Transaction = memoizedJSONParseTx(item.data);
      const txData = getTransactionMetadata(data);
      const containerRowStyle: StyleProp<ViewStyle> = isRecentActivityView ? styles.rowContainer : {};
      return (
        <TransactionRowClassifier
          item={item}
          parsedTx={data}
          classifiedTx={txData}
          contextTokenId={tokenId}
          navigation={navigation}
          filterInUnverifiedAssets={filterInUnverifiedAssets}
          filterInBlacklistedAssets={filterInBlacklistedAssets}
          onTransactionHide={onTransactionHide}
          containerStyle={containerRowStyle}
        />
      );
    },
    [isRecentActivityView, tokenId, navigation, filterInUnverifiedAssets, filterInBlacklistedAssets, onTransactionHide],
  );

  const renderPendingTransaction = useCallback(
    (item: RealmPendingTransaction) => {
      if (!item.isValid()) {
        return null;
      }
      const containerRowStyle: StyleProp<ViewStyle> = isRecentActivityView ? styles.rowContainer : {};

      return (
        <TransactionPendingRow
          item={item}
          contextTokenId={tokenId}
          succeed={!!item.confirmed}
          onDisappear={onPendingTxSucceed}
          isRecentActivityView={isRecentActivityView}
          containerStyle={containerRowStyle}
        />
      );
    },
    [isRecentActivityView, onPendingTxSucceed, tokenId],
  );

  const renderItem = useCallback(
    ({ item }: { item: TransactionListItem }) => {
      if (isSectionLabel(item)) {
        return (
          <Label exiting={FadeOut} type="boldTitle2" style={styles.label} color="light50" testID="SectionLabel">
            {item.label}
          </Label>
        );
      }

      if ('isValid' in item && !item.isValid()) {
        return null;
      }
      if (isPendingTransaction(item)) {
        return renderPendingTransaction(item);
      }
      return renderTransaction(item);
    },
    [renderPendingTransaction, renderTransaction],
  );

  return {
    dataSource,
    renderItem,
    renderFooter,
    keyExtractor,
    getItemType,
    loadNextPage,
  };
};
const styles = StyleSheet.create({
  sectionHeader: {
    marginVertical: 4,
  },
  loadMore: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  rowContainer: {
    paddingHorizontal: 12,
  },
  label: {
    marginTop: 18,
    marginBottom: 6,
  },
});
