import Realm from 'realm';

import { REALM_TYPE_TOKEN, RealmToken } from '@/realm/tokens/schema';

export const getTokenById = (realm: Realm, id: string | null) => {
  if (!id) {
    return null;
  }
  return realm.objectForPrimaryKey<RealmToken>(REALM_TYPE_TOKEN, id);
};
