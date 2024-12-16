import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from '../settings/schema';

import type { RealmSettings } from '../settings/schema';

export const migrationsSchemaVersion38 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 38) {
    newRealm.create<RealmSettings>(
      REALM_TYPE_SETTINGS,
      {
        name: RealmSettingsKey.isBrowserExploreTaskModalCompleted,
        value: false,
      },
      Realm.UpdateMode.Modified,
    );
  }
};
