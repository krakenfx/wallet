import AsyncStorage from '@react-native-async-storage/async-storage';
import Realm from 'realm';

import { cancelActiveRequestsAndInvalidateCache } from '@/api/base/fetchClient';
import { RealmSchema } from '@/realm/realmSchema';
import { clearAllKeychainValues } from '@/secureStore/keychain';

import { validateSchemaVersion } from './migrations';

import { WalletConnectSessionsManager } from '/modules/wallet-connect';

export const cleanAsyncStorage = async () => {
  await AsyncStorage.clear();
};

export const clearAppData = async () => {
  cancelActiveRequestsAndInvalidateCache();
  await clearAllKeychainValues();
  await cleanAsyncStorage();
  await validateSchemaVersion();
  WalletConnectSessionsManager.disconnectAllSessionsForAllAccounts();
  Realm.deleteFile({ schema: RealmSchema });
};
