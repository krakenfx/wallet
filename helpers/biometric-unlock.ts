import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import Keychain from 'react-native-keychain';

import crypto from 'crypto';

import { getAppLockSecret } from '@/secureStore';
import { KeychainKey, getFromKeychain, setInKeychain } from '@/secureStore/keychain';
import { decryptValue, encryptValue } from '@/secureStore/utils';


export let isAuthenticating = false;


const noStrongAuthCombination = Platform.OS === 'android' && Platform.Version < 30;

export async function biometricUnlock(useKeychain = true): Promise<boolean> {
  if (!(await isBiometricEnabled())) {
    return true;
  }

  if (useKeychain) {
    try {
      return !!(await getAppLockSecret());
    } catch {
      return false;
    }
  } else {
    return checkBiometrics();
  }
}


async function checkBiometrics(): Promise<boolean> {
  try {
    isAuthenticating = true;
    const { success } = await LocalAuthentication.authenticateAsync({
      biometricsSecurityLevel: noStrongAuthCombination ? undefined : 'strong',
    });
    return success;
  } catch (e) {
    console.warn('Biometrics authentication failed: ', e);
    return false;
  } finally {
    isAuthenticating = false;
  }
}

export async function isBiometricEnabled(): Promise<boolean> {
  const value = await getFromKeychain(KeychainKey.isBiometricsEnabledKey);
  if (value) {
    return JSON.parse(value); 
  }
  return false;
}

export const SECURITY_ENROLLED_NONE = 'SECURITY_ENROLLED_NONE';
let isEnablingBiometrics = false;
export async function enableBiometrics() {
  if (isEnablingBiometrics) {
    return false;
  }
  try {
    isEnablingBiometrics = true;
    if ((await getSupportedAuthentication()).securityLevelEnrolled === LocalAuthentication.SecurityLevel.NONE) {
      throw Error(SECURITY_ENROLLED_NONE);
    }
    if (await checkBiometrics()) {
      const appLockSecret = crypto.randomBytes(64).toString('hex');
      const mnemonic = await getFromKeychain(KeychainKey.mnemonicKey);
      const seed = await getFromKeychain(KeychainKey.seedBufferKey);
      const existingSecret = await getFromKeychain(KeychainKey.appLockSecretKey);
      if (existingSecret) {
        
        throw Error('Secret already exists');
      }
      if (!!mnemonic && !!seed) {
        const encrypedSeed = await encryptValue(seed, appLockSecret);
        const encrypedMnemonic = await encryptValue(mnemonic, appLockSecret, 'utf8');
        
        await setInKeychain(KeychainKey.appLockSecretKey, appLockSecret, true);
        await setInKeychain(KeychainKey.isBiometricsEnabledKey, 'true');
        await setInKeychain(KeychainKey.seedBufferKey, encrypedSeed);
        await setInKeychain(KeychainKey.mnemonicKey, encrypedMnemonic);
        return true;
      }
    } else {
      return false;
    }
  } finally {
    isEnablingBiometrics = false;
  }
}

export async function disableBiometrics() {
  const isEnabled = await isBiometricEnabled();
  if (!isEnabled) {
    return true;
  }
  const appLockSecret = await getFromKeychain(KeychainKey.appLockSecretKey, true);
  const mnemonic = await getFromKeychain(KeychainKey.mnemonicKey);
  const seed = await getFromKeychain(KeychainKey.seedBufferKey);
  if (appLockSecret && !!mnemonic && !!seed) {
    const decrypedSeed = await decryptValue(seed, appLockSecret);
    const decrypedMnemonic = await decryptValue(mnemonic, appLockSecret, 'utf8');
    await setInKeychain(KeychainKey.seedBufferKey, decrypedSeed);
    await setInKeychain(KeychainKey.mnemonicKey, decrypedMnemonic);
    
    await Keychain.resetGenericPassword({ service: KeychainKey.isBiometricsEnabledKey });
    await Keychain.resetGenericPassword({ service: KeychainKey.appLockSecretKey });
    return true;
  }
  return false;
}

export async function getSupportedAuthentication() {
  const authenticationTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const securityLevelEnrolled = await LocalAuthentication.getEnrolledLevelAsync();

  return {
    authenticationTypes,
    securityLevelEnrolled,
  };
}
