import { REALM_TYPE_SETTINGS } from './schema';

import type { RealmSettings, SettingsType } from './schema';
import type Realm from 'realm';

export function getSettingsByKey<T extends keyof SettingsType>(realm: Realm, key: T): SettingsType[T] | undefined {
  const result = realm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, key);
  return result?.value as SettingsType[T];
}
