import Keychain, { ACCESSIBLE, ACCESS_CONTROL, STORAGE_TYPE } from 'react-native-keychain';

import type { KeychainKey } from './keys';

export const isSecureDevice = async () => {
  return !!(await Keychain.getSupportedBiometryType());
};

const getAuthOptions = (hasBiometry: boolean): Keychain.Options =>
  hasBiometry
    ? {
        accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        storage: STORAGE_TYPE.RSA,
      }
    : {
        accessControl: ACCESS_CONTROL.DEVICE_PASSCODE,
        storage: STORAGE_TYPE.AES,
      };

export const setInKeychain = async (key: KeychainKey, password: string, withAppLock: boolean = false) => {
  const hasBiometry = await isSecureDevice();
  const biometricAuthOptions = withAppLock ? getAuthOptions(hasBiometry) : undefined;

  const options: Keychain.Options = {
    service: key,
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    securityLevel: (await Keychain.getSecurityLevel()) ?? undefined,
    storage: STORAGE_TYPE.AES,
    ...biometricAuthOptions,
  };

  if (hasBiometry) {
    await Keychain.resetGenericPassword({ service: key });
  }
  const savingResult = await Keychain.setGenericPassword(key, password, options);

  return !!savingResult;
};
