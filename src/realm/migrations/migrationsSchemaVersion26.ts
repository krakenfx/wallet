import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettings, RealmSettingsKey } from '../settings/schema';

export const migrationsSchemaVersion26 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 26) {
    newRealm.create<RealmSettings>(
      REALM_TYPE_SETTINGS,
      {
        name: RealmSettingsKey.whatsNewIsAssetMarketDataCompleted,
        value: false,
      },
      Realm.UpdateMode.Modified,
    );
  }
};
