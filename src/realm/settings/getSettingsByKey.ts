import Realm from 'realm';

import { REALM_TYPE_SETTINGS, RealmSettings, SettingsType } from './schema';

export function getSettingsByKey<T extends keyof SettingsType>(realm: Realm, key: T): SettingsType[T] | undefined {
  const result = realm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, key);
  return result?.value as SettingsType[T];
}
