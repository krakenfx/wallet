import * as RNLocalize from 'react-native-localize';
import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from '../settings/schema';

import type { RealmSettings } from '../settings/schema';

export const migrationsSchemaVersion40 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 40) {
    const appLanguage = oldRealm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, RealmSettingsKey.language);

    const shouldOmitTask = appLanguage?.value === 'en-GB' || !!RNLocalize.getLocales().find(l => l.countryCode === 'GB');
    if (shouldOmitTask) {
      return;
    }

    newRealm.create<RealmSettings>(
      REALM_TYPE_SETTINGS,
      {
        name: RealmSettingsKey.isSwapsTaskModalCompleted,
        value: false,
      },
      Realm.UpdateMode.Modified,
    );
  }
};
