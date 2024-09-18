import AsyncStorage from '@react-native-async-storage/async-storage';
import Realm from 'realm';

import { cancelActiveRequests } from '@/api/base/superFetch';
import { RealmSchema } from '@/realm/realmSchema';
import { clearAllKeychainValues } from '@/secureStore/keychain';

import { saveFeatureFlagsToStorage } from './featureFlags';
import { validateSchemaVersion } from './migrations';

import { WalletConnectSessionsManager } from '/modules/wallet-connect';

export const cleanAsyncStorage = async () => {
  await AsyncStorage.clear();
  await saveFeatureFlagsToStorage();
};

export const clearAppData = async () => {
  cancelActiveRequests();
  await clearAllKeychainValues();
  await cleanAsyncStorage();
  await validateSchemaVersion();
  WalletConnectSessionsManager.disconnectAllSessionsForAllAccounts();
  Realm.deleteFile({ schema: RealmSchema });
};
