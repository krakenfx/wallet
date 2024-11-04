import { useCallback, useRef } from 'react';

import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { isPromiseRejected } from '@/utils/promise';

import { useRealm } from '../RealmContext';

import { getWalletsForMutations } from '../wallets';

import { useTransactionMutations } from './useTransactionMutations';

import type { RealmWallet } from '../wallets';

import { handleError } from '/helpers/errorHandler';

export function useTransactionsFetch() {
  const { saveTransactionsToRealm } = useTransactionMutations();
  const getWalletStorage = useGetWalletStorage();
  const realm = useRealm();

  const isFetchingAll = useRef<boolean>(false);

  
  const fetchTransactions = useCallback(
    async (wallet: RealmWallet, refreshState: boolean) => {
      const { network, transport } = getImplForWallet(wallet);

      const walletStorage = await getWalletStorage(wallet, refreshState);
      await transport.fetchTransactions(network, wallet, walletStorage, async txs => {
        
        return saveTransactionsToRealm(wallet, txs);
      });
    },
    [getWalletStorage, saveTransactionsToRealm],
  );

  const fetchAllTransactionsForAllNetworks = useCallback(async () => {
    if (isFetchingAll.current) {
      return;
    }
    isFetchingAll.current = true;
    const accountWallets = getWalletsForMutations(realm);

    const results = await Promise.allSettled(accountWallets.map(wallet => fetchTransactions(wallet, true)));
    results.filter(isPromiseRejected).forEach(({ reason }) => handleError(reason, 'ERROR_CONTEXT_PLACEHOLDER'));
    isFetchingAll.current = false;
  }, [fetchTransactions, realm]);

  return { fetchTransactions, fetchAllTransactionsForAllNetworks };
}
