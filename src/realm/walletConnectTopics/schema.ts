import { ObjectSchema } from 'realm';

export type WalletConnectTopics = {
  pairingTopic: string;
  topic: string;
  isDeepLinked: boolean;
};

export type RealmWalletConnectTopics = RealmTypeOf<WalletConnectTopics>;

export const REALM_TYPE_WALLET_CONNECT_TOPICS = 'WalletConnectTopics';
export const WalletConnectTopicsSchema: ObjectSchema = {
  name: REALM_TYPE_WALLET_CONNECT_TOPICS,
  properties: {
    pairingTopic: 'string',
    topic: 'string',
    isDeepLinked: 'bool',
  },
  primaryKey: 'pairingTopic',
};
