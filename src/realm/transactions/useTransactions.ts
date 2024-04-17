import { useMemo } from 'react';

import { NETWORK_FILTERS } from '@/components/NetworkFilter/types';

import { useCurrentAccountNumber } from '../accounts';
import { useQuery, useRealm } from '../RealmContext';
import { useFilterInBlacklistedAssets, useFilterInUnverifiedAssets } from '../settings';

import { REALM_TYPE_WALLET_TRANSACTION, RealmTransaction } from './schema';
import { filterTransactionsByAssetInvolvement, filterTransactionsByNetwork } from './transactionFilters';
import { getShouldFilterOutTransactionByReputation } from './useShouldFilterOutTransactionByReputation';
import { memoizedJSONParseTx } from './utils';

interface Props {
  assetId?: string;
  walletId?: string;
  networkFilter?: NETWORK_FILTERS[];
  ignoredIds: string[];
}

export const useTransactions = ({ walletId, assetId, networkFilter, ignoredIds }: Props) => {
  const allTransactions = useQuery<RealmTransaction>(REALM_TYPE_WALLET_TRANSACTION);
  const accountNumber = useCurrentAccountNumber();
  const realm = useRealm();
  const filterInUnverifiedAssets = useFilterInUnverifiedAssets();
  const filterInBlacklistedAssets = useFilterInBlacklistedAssets();

  return useMemo(() => {
    let filteredTransactions = allTransactions.filtered('wallet.accountIdx = $0', accountNumber);

    if (networkFilter && networkFilter.length > 0) {
      filteredTransactions = filterTransactionsByNetwork<RealmTransaction>(filteredTransactions, networkFilter);
    }

    if (walletId) {
      filteredTransactions = filteredTransactions.filtered(`walletId = "${walletId}"`);
    }

    filteredTransactions = filteredTransactions.filtered('NOT id IN $0', ignoredIds);

    let sortedTransactions = filteredTransactions.sorted('time', true);

    let transactionsFilteredByReputation = sortedTransactions.filter(
      tx => !getShouldFilterOutTransactionByReputation(realm, memoizedJSONParseTx(tx.data), filterInUnverifiedAssets, filterInBlacklistedAssets),
    );

    return filterTransactionsByAssetInvolvement(transactionsFilteredByReputation, assetId);
  }, [allTransactions, accountNumber, ignoredIds, networkFilter, walletId, assetId, realm, filterInUnverifiedAssets, filterInBlacklistedAssets]);
};
