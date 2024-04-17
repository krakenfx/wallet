import { Platform } from 'react-native';
import Keychain from 'react-native-keychain';

import { isSecureDevice } from './keychain';
import { KeychainKey } from './keys';

import { biometricUnlock } from '/helpers/biometric-unlock';

export const getFromKeychain = async <T extends boolean>(
  key: KeychainKey,
  withAppLock?: boolean,
  throwOnError?: T,
): Promise<T extends true ? string : string | false> => {
  try {
    const showExpoPrompt = Platform.OS === 'android' || !isSecureDevice;
    if (withAppLock && showExpoPrompt) {
      if (!(await biometricUnlock(false))) {
        throw Error('Failed to unlock');
      }
    }
    const credentials = await Keychain.getGenericPassword({
      service: key,
    });
    if (credentials) {
      return credentials.password;
    } else {
      throw Error('No credentials');
    }
  } catch (e) {
    if (throwOnError) {
      throw e;
    } else {
      if (!(e instanceof Error && e.message === 'No credentials')) {
        console.error('[getFromKeychain] FAILED (false) for key: ', key, ' ', e);
      }
      return false as T extends true ? string : false;
    }
  }
};

export async function removeFromKeychain(service: KeychainKey) {
  return await Keychain.resetGenericPassword({ service });
}

export async function clearAllKeychainValues() {
  return Promise.all(Object.values(KeychainKey).map(service => Keychain.resetGenericPassword({ service })));
}

export * from './keychain';
export * from './keys';
