import { useCallback, useEffect, useRef } from 'react';

import { fetchWithdrawStatus } from '@/api/krakenConnect/fetchWithdrawStatus';
import { showToast } from '@/components/Toast';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';
import { useRealm } from '@/realm/RealmContext';
import { checkTokenGalleryChange } from '@/realm/tokenPrice/utils';
import { getTokenById, useTokensFetch, useTokensMutations } from '@/realm/tokens';
import type { RealmPendingTransaction } from '@/realm/transactions';
import { usePendingTransactions, useTransactionMutations } from '@/realm/transactions';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

const MAX_SOLANA_TX_DURATION = 2 * 60 * 1000;
const MAX_KRAKEN_TRANSFER_DURATION = 24 * 60 * 60 * 1000;

export const useMonitorPendingTransactions = () => {
  const interval = useRef<NodeJS.Timer>();
  const pendingTransactions = usePendingTransactions();
  const { confirmPendingTransaction, dangerouslyCleanupConfirmedTransactions, invalidatePendingTransaction } = useTransactionMutations();
  const { setTokenGalleryStatus } = useTokensMutations();
  const { fetchBalance } = useTokensFetch();
  const realm = useRealm();
  const { API_KEY, API_SECRET, CF_TOKEN } = useKrakenConnectCredentials();

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
        const isComplete = await transport.isTransactionComplete(network, tx.transactionId);
        if (isComplete && tx.isValid()) {
          confirmPendingTransaction(id);
          await fetchBalance(tx.wallet, false);
          const token = getTokenById(realm, tx.tokenId);
          if (token) {
            const galleryStatus = checkTokenGalleryChange(token, token.price);
            setTokenGalleryStatus(token, galleryStatus);
          }
        }
      }
    },
    [confirmPendingTransaction, fetchBalance, invalidatePendingTransaction, realm, setTokenGalleryStatus],
  );

  const checkPendingKrakenTransfer = useCallback(
    async (tx: RealmPendingTransaction) => {
      console.log('[useMonitorPendingTransactions] checking pending Kraken tx ', tx.transactionId);
      try {
        const { status, transactionId } = await fetchWithdrawStatus({
          refid: tx.transactionId,
          timestamp: tx.time,
          apiKey: API_KEY,
          privateKey: API_SECRET,
          cfToken: CF_TOKEN,
        });
        if (status === 'success') {
          if (tx.isValid()) {
            confirmPendingTransaction(tx.id, transactionId);
            await fetchBalance(tx.wallet, false);
          }
        } else {
          if (tx.time && Date.now() - tx.time * 1000 > MAX_KRAKEN_TRANSFER_DURATION) {
            invalidatePendingTransaction(tx.id);
          }
        }
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    },
    [API_KEY, API_SECRET, CF_TOKEN, confirmPendingTransaction, fetchBalance, invalidatePendingTransaction],
  );

  useEffect(() => {
    if (pendingTransactions.length > 0) {
      interval.current = setInterval(async () => {
        for (const tx of pendingTransactions) {
          if (tx.isValid() && !tx.confirmed) {
            if (tx.additionalStatus !== 'kraken-connect-to-wallet') {
              checkTransaction(tx);
            } else {
              checkPendingKrakenTransfer(tx);
            }
          }
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [checkPendingKrakenTransfer, checkTransaction, pendingTransactions]);

  useEffect(() => {
    dangerouslyCleanupConfirmedTransactions();
  }, [dangerouslyCleanupConfirmedTransactions]);
};
