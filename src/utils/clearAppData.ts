import AsyncStorage from '@react-native-async-storage/async-storage';
import Realm from 'realm';

import { cancelActiveRequests } from '@/api/base/superFetch';
import { RealmSchema } from '@/realm/realmSchema';
import { clearAllKeychainValues } from '@/secureStore/keychain';

import { validateSchemaVersion } from './migrations';

import { WalletConnectSessionsManager } from '/modules/wallet-connect';

export const clearAppData = async () => {
  cancelActiveRequests();
  await clearAllKeychainValues();
  await AsyncStorage.clear();
  await validateSchemaVersion();
  WalletConnectSessionsManager.disconnectAllSessionsForAllAccounts();
  Realm.deleteFile({ schema: RealmSchema });
};
