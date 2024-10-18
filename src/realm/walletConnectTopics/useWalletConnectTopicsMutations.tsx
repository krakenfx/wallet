import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_WALLET_CONNECT_TOPICS, RealmWalletConnectTopics } from './schema';

import { handleError } from '/helpers/errorHandler';

export const useWalletConnectTopicsMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const saveTopicToRealm = useCallback(
    (pairingTopic: string, topic: string, isDeepLinked: boolean) => {
      console.log('[useWalletConnectTopicsMutations] saving topic ' + topic);
      
      try {
        runInTransaction(() => {
          realm.create<RealmWalletConnectTopics>(
            REALM_TYPE_WALLET_CONNECT_TOPICS,
            {
              pairingTopic,
              topic,
              isDeepLinked,
            },
            Realm.UpdateMode.Never,
          );
        });
      } catch(e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    },

    [realm, runInTransaction],
  );

  const deleteSession = async (topic: string): Promise<void> => {
    realm.write(() => {
      realm.delete(realm.objects<RealmWalletConnectTopics>(REALM_TYPE_WALLET_CONNECT_TOPICS).filtered('topic = $0', topic));
    });
  };

  return {
    saveTopicToRealm,
    deleteSession,
  };
};
