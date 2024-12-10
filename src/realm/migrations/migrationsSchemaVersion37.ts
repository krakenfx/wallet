import { REALM_TYPE_TOKEN, type RealmToken } from '../tokens';

import type Realm from 'realm';

export const migrationsSchemaVersion37 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 37) {
    const inkNativeTokens = newRealm.objects<RealmToken>(REALM_TYPE_TOKEN).filtered("wallet.type == 'inkSepolia'");
    const label = 'Ethereum - Ink Sepolia';
    inkNativeTokens.forEach(token => {
      token.metadata.label = label;
      token.wallet.nativeTokenLabel = label;
    });
  }
};
