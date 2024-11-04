import { useCallback } from 'react';
import Realm from 'realm';

import type { Transaction } from '@/api/types';
import { tokenUnit2SmallestUnit } from '@/utils/unitConverter';

import { useRealm } from '../RealmContext';

import { REALM_TYPE_TOKEN, getAvailableTokenBalance } from '../tokens';

import { REALM_TYPE_TRANSACTION_NOTES } from '../transactionNotes';

import { REALM_TYPE_PENDING_TRANSACTION, REALM_TYPE_WALLET_TRANSACTION } from './schema';
import { convertToTimestamp, getCombinedTransactionId } from './utils';

import type { PendingTransaction, RealmPendingTransaction, RealmTransaction } from './schema';
import type { RealmToken } from '../tokens';
import type { RealmTransactionNotes } from '../transactionNotes';
import type { RealmWallet } from '../wallets';

export const useTransactionMutations = () => {
  const realm = useRealm();

  const saveTransactionsToRealm = useCallback(
    (wallet: RealmWallet, transactions: Transaction[]): boolean => {
      let foundExistingTransaction = false;

      realm.write(() => {
        for (const tx of transactions) {
          const txCombinedId = getCombinedTransactionId(wallet.id, tx.id);
          const confirmedTxExist = !!realm.objectForPrimaryKey(REALM_TYPE_WALLET_TRANSACTION, txCombinedId);
          const pendingTxExist = !!realm.objectForPrimaryKey(REALM_TYPE_PENDING_TRANSACTION, txCombinedId);

          if (confirmedTxExist || pendingTxExist) {
            foundExistingTransaction = true;
          }

          // @ts-expect-error not supported on BE yet
          if (tx.status === 'pending') {
            if (!pendingTxExist) {
              const effect = tx.effects[0];
              const assetId = 'assetId' in effect && effect.assetId;
              const tokenId = `${wallet.id}:${assetId}`;
              if (assetId && (effect.type === 'send' || effect.type === 'receive')) {
                const pendingTxObject = realm.create<RealmPendingTransaction>(
                  REALM_TYPE_PENDING_TRANSACTION,
                  {
                    id: txCombinedId,
                    transactionId: tx.id,
                    walletId: wallet.id,
                    wallet,
                    tokenId,
                    amount: 'amount' in effect ? effect.amount : null,
                    kind: effect.type,
                    type: 'coin',
                    from: 'sender' in effect ? effect.sender : null,
                    to: 'recipient' in effect ? effect.recipient : null,
                    time: null, 
                    fee: tx.fee?.amount ? tokenUnit2SmallestUnit(tx.fee.amount, wallet.nativeTokenDecimals).toFixed() : null,
                  },
                  Realm.UpdateMode.Modified,
                );
                const token = realm.objectForPrimaryKey<RealmToken>(REALM_TYPE_TOKEN, tokenId);
                if (token) {
                  token.pendingTransactions.push(pendingTxObject);
                }
              }
            }
          } else if (!confirmedTxExist) {
            if (tx.timestamp) {
              const notes = realm.objectForPrimaryKey<RealmTransactionNotes>(REALM_TYPE_TRANSACTION_NOTES, txCombinedId);
              const withNotes = notes ? { notes } : {};

              const transaction = {
                id: txCombinedId,
                walletId: wallet.id,
                wallet,
                transactionId: tx.id,
                data: JSON.stringify(tx),
                assetIds: [],
                time: convertToTimestamp(tx.timestamp),
                groupedTime: 0,
                fee: tx.fee?.amount,
                value: '0',
              };
              realm.create<RealmTransaction>(REALM_TYPE_WALLET_TRANSACTION, { ...transaction, ...withNotes }, Realm.UpdateMode.Modified);
            }
          }
        }
      });

      return foundExistingTransaction;
    },
    [realm],
  );

  const savePendingTransaction = useCallback(
    (tx: PendingTransaction, wallet: RealmWallet) => {
      realm.write(() => {
        const pendingTxObject = realm.create<RealmPendingTransaction>(REALM_TYPE_PENDING_TRANSACTION, { ...tx, wallet }, Realm.UpdateMode.Modified);
        if (tx.tokenId) {
          const token = realm.objectForPrimaryKey<RealmToken>(REALM_TYPE_TOKEN, tx.tokenId);
          if (token) {
            token.pendingTransactions.push(pendingTxObject);
          }
        }
      });
    },
    [realm],
  );

  const removePendingTransaction = useCallback(
    (id: string) => {
      const toDelete = realm.objectForPrimaryKey(REALM_TYPE_PENDING_TRANSACTION, id);
      if (toDelete) {
        realm.write(() => {
          realm.delete(toDelete);
        });
      }
    },
    [realm],
  );

  const confirmPendingTransaction = useCallback(
    (id: string) => {
      const pendingTx = realm.objectForPrimaryKey<RealmPendingTransaction>(REALM_TYPE_PENDING_TRANSACTION, id);
      if (pendingTx) {
        const token = pendingTx.tokenId ? realm.objectForPrimaryKey<RealmToken>(REALM_TYPE_TOKEN, pendingTx.tokenId) : undefined;

        realm.write(() => {
          if (token) {
            
            token.balance = getAvailableTokenBalance(token);
          }
          pendingTx.confirmed = true;
        });
      }
    },
    [realm],
  );

  
  const dangerouslyCleanupConfirmedTransactions = useCallback(async () => {
    const confirmedTransactions = realm
      .objects<RealmPendingTransaction>(REALM_TYPE_PENDING_TRANSACTION)
      .filtered('confirmed == true OR additionalStatus == "invalidated"');
    if (confirmedTransactions.length > 0) {
      realm.write(() => {
        realm.delete(confirmedTransactions);
      });
    }
    
    return new Promise(resolve => setTimeout(resolve, 100));
  }, [realm]);

  const invalidatePendingTransaction = useCallback(
    (id: string) => {
      const pendingTx = realm.objectForPrimaryKey<RealmPendingTransaction>(REALM_TYPE_PENDING_TRANSACTION, id);
      if (pendingTx) {
        console.log('[invalidatePendingTransaction] ', id);
        realm.write(() => {
          pendingTx.additionalStatus = 'invalidated';
        });
      }
    },
    [realm],
  );

  return {
    saveTransactionsToRealm,
    savePendingTransaction,
    removePendingTransaction,
    confirmPendingTransaction,
    dangerouslyCleanupConfirmedTransactions,
    invalidatePendingTransaction,
  };
};
