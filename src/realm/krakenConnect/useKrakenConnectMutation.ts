import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';

import { useRealm } from '../RealmContext';

import { KRAKEN_CONNECT_CREDENTIALS_REALM_KEY, REALM_TYPE_KRAKEN_CONNECT_CREDENTIALS, REALM_TYPE_KRAKEN_OAUTH_VERIFICATION } from './schema';

import type { KrakenConnectCredentials, KrakenConnectOauthVerification } from './schema';

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

  const saveOauthVerification = useCallback(
    (challenge: string, verification: string) => {
      runInTransaction(() => {
        realm.create<KrakenConnectOauthVerification>(
          REALM_TYPE_KRAKEN_OAUTH_VERIFICATION,
          {
            challenge,
            verification,
          },
          Realm.UpdateMode.Modified,
        );
      });
    },
    [realm, runInTransaction],
  );

  const deleteOauthVerification = useCallback(() => {
    runInTransaction(() => {
      realm.delete(realm.objects(REALM_TYPE_KRAKEN_OAUTH_VERIFICATION));
    });
  }, [realm, runInTransaction]);

  return {
    saveExchangeCredentials,
    deleteExchangeCredentials,
    saveOauthVerification,
    deleteOauthVerification,
  };
};
