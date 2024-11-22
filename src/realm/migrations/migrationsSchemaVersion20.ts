import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from '../settings';

import type { RealmSettings } from '../settings';

export const migrationsSchemaVersion20 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 20) {
    const settings = newRealm.objectForPrimaryKey(REALM_TYPE_SETTINGS, 'walletConnectExplainerNeeded');

    if (settings && (settings as RealmSettings).value === false) {
      newRealm.delete(settings);
      newRealm.create<RealmSettings>(
        REALM_TYPE_SETTINGS,
        {
          name: RealmSettingsKey.walletConnectTaskCompleted,
          value: true,
        },
        Realm.UpdateMode.Modified,
      );
    }
  }
};
