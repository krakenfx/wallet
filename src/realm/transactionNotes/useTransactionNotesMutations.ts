import { useCallback } from 'react';
import Realm from 'realm';

import { useRealm } from '../RealmContext';
import { REALM_TYPE_PENDING_TRANSACTION, REALM_TYPE_WALLET_TRANSACTION, RealmTransaction } from '../transactions';

import { REALM_TYPE_TRANSACTION_NOTES, RealmTransactionNotes } from './schema';

export const useTransactionNotesMutations = () => {
  const realm = useRealm();

  const addTransactionNotes = useCallback(
    (walletId: string, transactionId: string, notes: string) => {
      realm.write(() => {
        const realmNotes = realm.create<RealmTransactionNotes>(
          REALM_TYPE_TRANSACTION_NOTES,
          {
            id: `${walletId}:${transactionId}`,
            value: notes,
          },
          Realm.UpdateMode.Modified,
        );
        const transaction = realm.objectForPrimaryKey<RealmTransaction>(REALM_TYPE_WALLET_TRANSACTION, realmNotes.id);
        const pendingTransaction = realm.objectForPrimaryKey<RealmTransaction>(REALM_TYPE_PENDING_TRANSACTION, realmNotes.id);
        if (transaction) {
          transaction.notes = realmNotes;
        }
        if (pendingTransaction) {
          pendingTransaction.notes = realmNotes;
        }
      });
    },
    [realm],
  );

  return {
    addTransactionNotes,
  };
};
