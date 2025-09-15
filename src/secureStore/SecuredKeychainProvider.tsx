import type { PropsWithChildren } from 'react';

import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

import { Keyboard, Platform } from 'react-native';

import { useLockout } from '@/screens/Settings/passwordProtection/hooks/useLockout';
import { PasswordProtectionSheet } from '@/screens/Settings/passwordProtection/PasswordProtectionSheet';
import type { PasswordProtectionModalRef, Rationale } from '@/screens/Settings/passwordProtection/PasswordProtectionSheet';

import { loadMnemonicSlow } from '@/utils/loadMnemonicSlow';

import { getAppLockSecret, retrieveMnemonic, retrieveSeed } from './domains';
import { KeychainKey, getFromKeychain } from './keychain';
import { hexStringToBuffer } from './utils';

interface SecretWithPassword {
  secret: string;
  password: string | undefined;
}

export interface SecuredKeychainContext {
  getMnemonic: <T extends boolean>(throwOnError?: T, rationale?: Rationale) => Promise<T extends true ? SecretWithPassword : SecretWithPassword | false>;
  getSeed: <T extends boolean>(rationale: Rationale, throwOnError?: T) => Promise<T extends true ? ArrayBuffer : ArrayBuffer | false>;
}
const SecuredKeychainContext = createContext<SecuredKeychainContext>({
  getMnemonic: () => Promise.reject(),
  getSeed: () => Promise.reject(),
});

export const SecuredKeychainProvider = ({ children }: PropsWithChildren) => {
  const sheetRef = useRef<PasswordProtectionModalRef>(null);
  const resolveResult = useRef<(value: SecretWithPassword | PromiseLike<SecretWithPassword>) => void>();
  const retrieve = useRef<typeof retrieveMnemonic | typeof retrieveSeed>();
  const appLockSecret = useRef<string | false>();

  const lockout = useLockout();

  const reset = () => {
    resolveResult.current = undefined;
    retrieve.current = undefined;
    appLockSecret.current = undefined;
  };

  const getSecuredValue = useCallback(async (rationale: Rationale): Promise<SecretWithPassword> => {
    const retrieveSecret = retrieve.current;
    console.log('[getSecuredValue] called, rationale: ', rationale);

    if (!retrieveSecret) {
      throw Error('Internal error: failed to retrieve secure value');
    }
    try {
      appLockSecret.current = await getAppLockSecret();
    } catch (e) {
      reset();
      console.log('[getSecuredValue] FAILED rationale: ', rationale, ' ', e);
      throw Error('Biometrics failed');
    }

    const isPasswordProtected = await getFromKeychain(KeychainKey.isSeedEncryptedKey);

    if (!isPasswordProtected) {
      try {
        const secret = await retrieveSecret(appLockSecret.current || undefined);
        return { secret, password: undefined };
      } finally {
        reset();
      }
    }
    return new Promise(resolve => {
      resolveResult.current = resolve;
      sheetRef.current?.present(rationale);
    });
  }, []);

  const checkPassword = async (password: string) => {
    try {
      if (!retrieve.current) {
        throw Error('Internal error: failed to retrieve secure value');
      }
      const value = await retrieve.current(appLockSecret.current || undefined, password);
      Keyboard.dismiss();
      lockout.onSuccessfulAttempt();
      resolveResult.current?.({
        secret: value,
        password,
      });
      sheetRef.current?.dismiss();
      reset();
    } catch {
      lockout.onFailedAttempt();
      sheetRef.current?.showError();
    }
  };

  const setRetrieveFunction = (fun: typeof retrieve.current) => {
    if (retrieve.current) {
      throw Error('SecuredKeychainContext is busy');
    } else {
      retrieve.current = fun;
    }
  };

  const getMnemonic = useCallback(
    async <T extends boolean>(throwOnError?: T, rationale?: Rationale) => {
      try {
        console.log('[getMnemonic] called');
        setRetrieveFunction(retrieveMnemonic);
        return getSecuredValue(rationale ?? 'viewPhrase');
      } catch (e) {
        if (throwOnError) {
          throw e;
        } else {
          return false as T extends true ? SecretWithPassword : false;
        }
      }
    },
    [getSecuredValue],
  );

  const getSeed = useCallback(
    async <T extends boolean>(rationale: Rationale, throwOnError?: T) => {
      try {
        console.log('[getSeed] called');
        if (Platform.OS === 'android' && Platform.Version === 36) {
          setRetrieveFunction(retrieveMnemonic);
          const { secret } = await getSecuredValue(rationale);
          const seedBuffer = await loadMnemonicSlow(secret);
          return seedBuffer;
        }
        setRetrieveFunction(retrieveSeed);
        const { secret } = await getSecuredValue(rationale);
        return hexStringToBuffer(secret);
      } catch (e) {
        if (throwOnError) {
          throw e;
        } else {
          return false as T extends true ? ArrayBuffer : false;
        }
      }
    },
    [getSecuredValue],
  );

  const onDismiss = () => {
    resolveResult.current?.(Promise.reject(new Error('Sheet dimissed')));
    reset();
  };

  const value = useMemo(() => ({ getMnemonic, getSeed }), [getMnemonic, getSeed]);

  return (
    <SecuredKeychainContext.Provider value={value}>
      {children}
      <PasswordProtectionSheet ref={sheetRef} checkPassword={checkPassword} onDismiss={onDismiss} lockout={lockout} />
    </SecuredKeychainContext.Provider>
  );
};

export const useSecuredKeychain = (): SecuredKeychainContext => {
  const context = useContext(SecuredKeychainContext);
  if (context === undefined) {
    throw new Error('useSecuredKeychain must be used within a SecuredKeychainContext');
  }
  return context;
};
