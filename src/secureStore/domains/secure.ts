import AsyncStorage from '@react-native-async-storage/async-storage';
import Keychain, { ACCESSIBLE } from 'react-native-keychain';
import Realm from 'realm';

import crypto from 'crypto';

import { RealmSchema } from '@/realm/realmSchema';

import { cleanAsyncStorage } from '@/utils/clearAppData';
import { retryPromise } from '@/utils/retryPromise';

import { isRealmInAppEverInitialisedKey } from '../asyncStorageKeys';
import { clearAllKeychainValues, getFromKeychain, removeFromKeychain, setInKeychain } from '../keychain';
import { KeychainKey } from '../keychain/keys';

import { arrayBufferToHexString, decryptBuffer, decryptValue, encryptBuffer, encryptValue, hexStringToInt8Array } from '../utils';

import type { Encoding } from '../utils';

import { isBiometricEnabled } from '/helpers/biometric-unlock';

export async function validateCleanKeychainOnInstall() {
  const isRealmInAppEverInitialised = await retryPromise(async () => await AsyncStorage.getItem(isRealmInAppEverInitialisedKey));
  const hasRealmKey = await retryPromise(async () => !!(await getFromKeychain(KeychainKey.realmEncryptionKey, false, true)));

  if (!isRealmInAppEverInitialised) {
    await clearAllKeychainValues();
    if (Realm.exists({ schema: RealmSchema })) {
      Realm.deleteFile({ schema: RealmSchema });
    }
  } else if (!hasRealmKey) {
    await clearAllKeychainValues();
    await cleanAsyncStorage();
    Realm.deleteFile({ schema: RealmSchema });
  }
}

export async function getRealmEncryptionKey(encryptionPassword?: string): Promise<Int8Array> {
  let password;

  const credentials = await getFromKeychain(KeychainKey.realmEncryptionKey);

  if (credentials) {
    password = credentials;
  } else {
    console.log('creating brand new realm encryption key...');
    password = crypto.randomBytes(64).toString('hex');
    await Keychain.setGenericPassword(KeychainKey.realmEncryptionKey, password, {
      service: KeychainKey.realmEncryptionKey,
      accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    await AsyncStorage.setItem(isRealmInAppEverInitialisedKey, 'true');
  }

  const ret = hexStringToInt8Array(password);
  if (encryptionPassword) {
    return await decryptBuffer(ret, encryptionPassword);
  }

  return ret;
}

export async function getAppLockSecret() {
  const shouldThrowOnError = await isBiometricEnabled();
  return await getFromKeychain(KeychainKey.appLockSecretKey, true, shouldThrowOnError);
}

export async function retrieveAppLockProtectedValue(key: KeychainKey, secret?: string | false, encoding?: Encoding) {
  const value = await getFromKeychain(key, false, true);
  if (secret) {
    return await decryptValue(value, secret, encoding);
  }
  return value;
}

export async function saveAppLockProtectedValue(key: KeychainKey, value: string, secret?: string | false, encoding?: Encoding) {
  if (secret) {
    return await setInKeychain(key, await encryptValue(value, secret, encoding), false);
  }
  return await setInKeychain(key, value, false);
}

export async function transformAppLockProtectedData(transform: (data: string, encoding: Encoding) => Promise<string>) {
  const appLockSecret = await getAppLockSecret();
  const seed = await retrieveAppLockProtectedValue(KeychainKey.seedBufferKey, appLockSecret, 'hex');
  const mnemonic = await retrieveAppLockProtectedValue(KeychainKey.mnemonicKey, appLockSecret, 'utf8');
  await saveAppLockProtectedValue(KeychainKey.seedBufferKey, await transform(seed, 'hex'), appLockSecret, 'hex');
  await saveAppLockProtectedValue(KeychainKey.mnemonicKey, await transform(mnemonic, 'utf8'), appLockSecret, 'utf8');
}

export async function encryptSeedWithUserPassword(password: string) {
  await transformAppLockProtectedData((data, encoding) => encryptValue(data, password, encoding));
  await setInKeychain(KeychainKey.isSeedEncryptedKey, 'true');
}

export async function decryptSeedWithUserPassword(password: string) {
  await transformAppLockProtectedData((data, encoding) => decryptValue(data, password, encoding));
  await removeFromKeychain(KeychainKey.isSeedEncryptedKey);
}

export async function retrieveMnemonic(appLockSecret?: string, password?: string) {
  const value = await retrieveAppLockProtectedValue(KeychainKey.mnemonicKey, appLockSecret, 'utf8');
  const isPasswordProtected = await getFromKeychain(KeychainKey.isSeedEncryptedKey);
  if (isPasswordProtected) {
    if (!password) {
      throw Error('Trying to decrypt with empty password');
    }
    return decryptValue(value, password, 'utf8');
  }
  return value;
}

export async function retrieveSeed(appLockSecret?: string, password?: string) {
  const value = await retrieveAppLockProtectedValue(KeychainKey.seedBufferKey, appLockSecret, 'hex');
  const isPasswordProtected = await getFromKeychain(KeychainKey.isSeedEncryptedKey);
  if (isPasswordProtected) {
    if (!password) {
      throw Error('Trying to decrypt with empty password');
    }
    return decryptValue(value, password, 'hex');
  }
  return value;
}

export async function encryptRealmEncryptionKey(password: string) {
  const encryptionKey = await getFromKeychain(KeychainKey.realmEncryptionKey, false, true);
  const data = await encryptBuffer(hexStringToInt8Array(encryptionKey), password);
  await setInKeychain(KeychainKey.realmEncryptionKey, arrayBufferToHexString(data));
  await setInKeychain(KeychainKey.isStorageEncryptedKey, 'true');
}

export async function decryptRealmEncryptionKey(password: string) {
  const encryptionKey = await getFromKeychain(KeychainKey.realmEncryptionKey, false, true);
  const data = await decryptBuffer(hexStringToInt8Array(encryptionKey), password);
  await setInKeychain(KeychainKey.realmEncryptionKey, arrayBufferToHexString(data));
  await removeFromKeychain(KeychainKey.isStorageEncryptedKey);
}
