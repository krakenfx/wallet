import { useCallback, useEffect, useRef } from 'react';

import { showToast } from '@/components/Toast';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useTokensFetch } from '@/realm/tokens';
import { RealmPendingTransaction, usePendingTransactions, useTransactionMutations } from '@/realm/transactions';

import loc from '/loc';

const MAX_SOLANA_TX_DURATION = 2 * 60 * 1000;

export const useMonitorPendingTransactions = () => {
  const interval = useRef<NodeJS.Timer>();
  const pendingTransactions = usePendingTransactions();
  const { confirmPendingTransaction, dangerouslyCleanupConfirmedTransactions, invalidatePendingTransaction } = useTransactionMutations();
  const { fetchBalance } = useTokensFetch();

  const checkTransaction = useCallback(
    async (tx: RealmPendingTransaction) => {
      if (tx.isValid()) {
        const { wallet, id } = tx;
        const { transport, network } = getImplForWallet(wallet);
        console.log('[useMonitorPendingTransactions] checking pending tx ', tx.transactionId);
        if (wallet.type === 'solana') {
          if (tx.time && Date.now() - tx.time * 1000 > MAX_SOLANA_TX_DURATION) {
            await showToast({
              type: 'error',
              text: loc
                .formatString(loc.globalActivity.transactionFailedInfo, {
                  network: wallet.type,
                })
                .toString(),
              dismissMode: 'onlyManual',
            });
            invalidatePendingTransaction(id);
            return;
          }
        }
        const isConfirmed = await transport.getTransactionStatus(network, tx.transactionId);
        if (isConfirmed && tx.isValid()) {
          confirmPendingTransaction(id);
          fetchBalance(tx.wallet, false);
        }
      }
    },
    [confirmPendingTransaction, fetchBalance, invalidatePendingTransaction],
  );

  useEffect(() => {
    if (pendingTransactions.length > 0) {
      interval.current = setInterval(async () => {
        for (const tx of pendingTransactions) {
          if (tx.isValid() && !tx.confirmed) {
            checkTransaction(tx);
          }
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [checkTransaction, pendingTransactions]);

  useEffect(() => {
    dangerouslyCleanupConfirmedTransactions();
  }, [dangerouslyCleanupConfirmedTransactions]);
};
