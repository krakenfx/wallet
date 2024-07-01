import { useQuery } from '@/realm/RealmContext';

import { REALM_TYPE_SETTINGS, RealmSettings, SettingsType } from './schema';

export function useSettingsByKey<T extends keyof SettingsType>(key: T): SettingsType[T] | undefined {
  const results = useQuery<RealmSettings>(REALM_TYPE_SETTINGS, settings => settings.filtered(`name = "${key}"`), [key]);
  if (results.isEmpty()) {
    return;
  }
  return results[0].value as SettingsType[T];
}
