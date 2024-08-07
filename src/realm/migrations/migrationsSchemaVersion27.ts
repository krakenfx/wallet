import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettings, RealmSettingsKey } from '../settings/schema';

export const migrationsSchemaVersion27 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 27) {
    newRealm.create<RealmSettings>(
      REALM_TYPE_SETTINGS,
      {
        name: RealmSettingsKey.whatsNewIsLongPressCompleted,
        value: false,
      },
      Realm.UpdateMode.Modified,
    );
  }
};
