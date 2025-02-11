import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';

import { useRealm } from '../RealmContext';

import { KRAKEN_CONNECT_CREDENTIALS_REALM_KEY, REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS } from './schema';

import type { KrakenConnectCredentials } from './schema';

export const useKrakenConnectMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const saveExchangeCredentials = useCallback(
    (apiKey: string, apiPrivateKey: string) => {
      runInTransaction(() => {
        realm.create<KrakenConnectCredentials>(
          REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS,
          {
            primaryKey: KRAKEN_CONNECT_CREDENTIALS_REALM_KEY,
            apiKey: apiKey,
            apiPrivateKey: apiPrivateKey,
            date: Date.now(),
          },
          Realm.UpdateMode.Modified,
        );
      });
    },
    [realm, runInTransaction],
  );

  const deleteExchangeCredentials = useCallback(() => {
    runInTransaction(() => {
      realm.delete(realm.objects(REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS));
    });
  }, [realm, runInTransaction]);

  return {
    saveExchangeCredentials,
    deleteExchangeCredentials,
  };
};
