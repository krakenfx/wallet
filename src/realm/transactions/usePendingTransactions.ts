import { useMemo } from 'react';

import type { NETWORK_FILTER } from '@/components/NetworkFilter/types';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useCurrentAccountNumber } from '@/realm/accounts';
import { useQuery } from '@/realm/RealmContext';
import type { RealmPendingTransaction } from '@/realm/transactions/schema';
import { REALM_TYPE_PENDING_TRANSACTION } from '@/realm/transactions/schema';
import { filterTransactionsByNetwork } from '@/realm/transactions/transactionFilters';

export const usePendingTransactions = (networkFilter?: NETWORK_FILTER[]) => {
  const currentAccountIdx = useCurrentAccountNumber();
  return useQuery<RealmPendingTransaction>(
    REALM_TYPE_PENDING_TRANSACTION,
    pendingTransactions => {
      const filteredTransactions = pendingTransactions
        .filtered('wallet.accountIdx = $0 AND additionalStatus != "invalidated"', currentAccountIdx)
        .sorted('time', true);

      if (networkFilter && networkFilter.length > 0) {
        return filterTransactionsByNetwork(filteredTransactions, networkFilter);
      }
      return filteredTransactions;
    },
    [currentAccountIdx, networkFilter],
  );
};

export const usePendingNftTransactions = (assetId?: string, walletId?: string, networkFilter?: NETWORK_FILTER[]) => {
  const pendingTransactions = usePendingTransactions();
  let isNativeCoin = true;
  if (assetId) {
    isNativeCoin = Object.values(ChainAgnostic).includes(assetId);
  }

  return useMemo(() => {
    if (!isNativeCoin) {
      return [];
    }
    const filteredTransactions = pendingTransactions.filtered(`walletId = "${walletId}" AND type = "nft"`).sorted('time', true);
    if (networkFilter && networkFilter.length > 0) {
      return filterTransactionsByNetwork(filteredTransactions, networkFilter);
    }
    return filteredTransactions;
  }, [isNativeCoin, pendingTransactions, walletId, networkFilter]);
};
