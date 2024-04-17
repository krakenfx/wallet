import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import crypto from 'crypto';

import { KeychainKey, getFromKeychain, setInKeychain } from '@/secureStore/keychain';
import { arrayBufferToHexString, encryptValue } from '@/secureStore/utils';

import { loadMnemonicSlow } from '../loadMnemonicSlow';

export const migrateToVersion8 = async () => {
  const isStorageEncryptedKey = await AsyncStorage.getItem(KeychainKey.isStorageEncryptedKey);
  if (isStorageEncryptedKey) {
    await setInKeychain(KeychainKey.isStorageEncryptedKey, isStorageEncryptedKey);
    await AsyncStorage.removeItem(KeychainKey.isStorageEncryptedKey);
  }

  const isApplockEnabled = await getFromKeychain(KeychainKey.isBiometricsEnabledKey);
  const existingAppLockSecret = await getFromKeychain(KeychainKey.appLockSecretKey);
  if (isApplockEnabled && !existingAppLockSecret) {
    const mnemonic = await retrieveMnemonic();
    const seed = arrayBufferToHexString(await loadMnemonicSlow(mnemonic));
    const appLockSecret = crypto.randomBytes(64).toString('hex');
    const encrypedSeed = await encryptValue(seed, appLockSecret);
    const encrypedMnemonic = await encryptValue(mnemonic, appLockSecret, 'utf8');
    await setInKeychain(KeychainKey.seedBufferKey, encrypedSeed);
    await setInKeychain(KeychainKey.mnemonicKey, encrypedMnemonic);

    await setInKeychain(KeychainKey.appLockSecretKey, appLockSecret, true);
    await setInKeychain(KeychainKey.isBiometricsEnabledKey, 'true');
  }
};

async function retrieveMnemonic(): Promise<string> {
  const mnemonic = await getFromKeychain(KeychainKey.mnemonicKey);
  if (!mnemonic) {
    await showAlertAndWaitForButtonPress();
    return retrieveMnemonic();
  }

  return mnemonic;
}

async function showAlertAndWaitForButtonPress(): Promise<void> {
  return new Promise(resolve => {
    Alert.alert(
      'Error ocurred',
      'Please try again to migrate data correctly or reinstall the app',
      [
        {
          text: 'Retry',
          onPress: () => resolve(),
        },
      ],
      { cancelable: false },
    );
  });
}
