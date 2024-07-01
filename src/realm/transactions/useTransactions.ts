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
  const accountNumber = useCurrentAccountNumber();
  const realm = useRealm();
  const filterInUnverifiedAssets = useFilterInUnverifiedAssets();
  const filterInBlacklistedAssets = useFilterInBlacklistedAssets();

  const sortedTransactions = useQuery<RealmTransaction>(
    REALM_TYPE_WALLET_TRANSACTION,
    allTransactions => {
      let filteredTransactions = allTransactions.filtered('wallet.accountIdx = $0', accountNumber);

      if (networkFilter && networkFilter.length > 0) {
        filteredTransactions = filterTransactionsByNetwork(filteredTransactions, networkFilter);
      }

      if (walletId) {
        filteredTransactions = filteredTransactions.filtered(`walletId = "${walletId}"`);
      }

      filteredTransactions = filteredTransactions.filtered('NOT id IN $0', ignoredIds);

      return filteredTransactions.sorted('time', true);
    },
    [networkFilter, ignoredIds, accountNumber, walletId],
  );

  return useMemo(() => {
    const transactionsFilteredByReputation = sortedTransactions.filter(
      tx => !getShouldFilterOutTransactionByReputation(realm, memoizedJSONParseTx(tx.data), filterInUnverifiedAssets, filterInBlacklistedAssets),
    );
    return filterTransactionsByAssetInvolvement(transactionsFilteredByReputation, assetId);
  }, [sortedTransactions, assetId, realm, filterInUnverifiedAssets, filterInBlacklistedAssets]);
};
