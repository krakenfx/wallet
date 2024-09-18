import { useCallback } from 'react';
import Realm from 'realm';

import { useRealm } from '../RealmContext';

export function useRealmTransaction() {
  const realm = useRealm();

  
  const runInTransaction = useCallback(
    function <T extends (arg0: Realm) => any>(callback: T): ReturnType<T> {
      const shouldHandleTransaction = !realm.isInTransaction;
      if (shouldHandleTransaction) {
        realm.beginTransaction();
      }
      try {
        const result = callback(realm);
        if (shouldHandleTransaction) {
          realm.commitTransaction();
        }
        return result;
      } catch (e) {
        if (shouldHandleTransaction) {
          realm.cancelTransaction();
        }
        throw e;
      }
    },
    [realm],
  );

  return { runInTransaction };
}
