import Realm from 'realm';

import { REALM_TYPE_PENDING_TRANSACTION, REALM_TYPE_WALLET_TRANSACTION } from '../transactions';


export const migrationsSchemaVersion18 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 18) {
    newRealm.delete(newRealm.objects(REALM_TYPE_WALLET_TRANSACTION).filtered('wallet.type == $0', 'HDsegwitBech32'));
    newRealm.delete(newRealm.objects(REALM_TYPE_PENDING_TRANSACTION).filtered('wallet.type == $0', 'HDsegwitBech32'));
  }
};
