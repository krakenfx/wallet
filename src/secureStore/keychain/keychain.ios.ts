import DeviceInfo from 'react-native-device-info';
import Keychain, { ACCESSIBLE, ACCESS_CONTROL, AUTHENTICATION_TYPE } from 'react-native-keychain';

export const isSecureDevice = async () => {
  if (DeviceInfo.isEmulatorSync()) {
    return false;
  }
  return Keychain.canImplyAuthentication();
};

export const setInKeychain = async (key: string, password: string, withAppLock: boolean = false) => {
  const isBiometrySupported = await Keychain.getSupportedBiometryType();

  const accessControl = isBiometrySupported ? ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE : ACCESS_CONTROL.DEVICE_PASSCODE;

  const biometricAuthOptions = withAppLock
    ? {
        accessControl,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
      }
    : undefined;
  const options: Keychain.Options = {
    service: key,
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    ...biometricAuthOptions,
  };
  const savingResult = await Keychain.setGenericPassword(key, password, options);

  return !!savingResult;
};
