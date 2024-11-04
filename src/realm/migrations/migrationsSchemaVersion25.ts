import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from '../settings/schema';

import type { RealmSettings } from '../settings/schema';

export const migrationsSchemaVersion25 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 25) {
    newRealm.create<RealmSettings>(
      REALM_TYPE_SETTINGS,
      {
        name: RealmSettingsKey.isBlastModalCompleted,
        value: false,
      },
      Realm.UpdateMode.Modified,
    );
  }
};
