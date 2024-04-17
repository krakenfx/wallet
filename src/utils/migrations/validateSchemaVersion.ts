import AsyncStorage from '@react-native-async-storage/async-storage';

import { realmConfig } from '@/realm/realmSchema';
import { latestRealmSchemaVersion } from '@/secureStore/asyncStorageKeys';

export const validateSchemaVersion = async () => {
  const prevVersion = await AsyncStorage.getItem(latestRealmSchemaVersion);
  if (!prevVersion) {
    await AsyncStorage.setItem(latestRealmSchemaVersion, String(realmConfig.schemaVersion));
  }
};
