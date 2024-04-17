import AsyncStorage from '@react-native-async-storage/async-storage';

import { realmConfig } from '@/realm/realmSchema';
import { validateCleanKeychainOnInstall } from '@/secureStore';
import { latestRealmSchemaVersion } from '@/secureStore/asyncStorageKeys';

export const runMigrations = async () => {
  await validateCleanKeychainOnInstall();
  const prevVersion = Number((await AsyncStorage.getItem(latestRealmSchemaVersion)) ?? 0);
  console.log('[runMigrations] check, prevVersion: ', prevVersion, ' current schema version: ', realmConfig.schemaVersion);

  if (prevVersion !== realmConfig.schemaVersion) {
    await AsyncStorage.setItem(latestRealmSchemaVersion, String(realmConfig.schemaVersion));
  }
};

export * from './validateSchemaVersion';
