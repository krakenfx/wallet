import Realm from 'realm';

import { REALM_TYPE_WALLET_CONNECT_TOPICS, RealmWalletConnectTopics } from '@/realm/walletConnectTopics';

export const sessionIsDeepLinked = (realm: Realm, topic: string): boolean => {
  const realmSessionTopics = realm.objects<RealmWalletConnectTopics>(REALM_TYPE_WALLET_CONNECT_TOPICS).filtered('topic = $0', topic);
  if (realmSessionTopics.length === 0 || !realmSessionTopics[0]) {
    throw new Error(`Session topic ${topic} does not exist in realm`);
  }
  return realmSessionTopics[0].isDeepLinked;
};
