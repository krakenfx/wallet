import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { HomeLockScreen } from '@/screens/Settings/passwordProtection';
import { getRealmEncryptionKey } from '@/secureStore';
import { KeychainKey, getFromKeychain } from '@/secureStore/keychain';

import { RealmProvider } from './RealmContext';

import { handleError } from '/helpers/errorHandler';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

interface SecuredRealmProps {
  wipeEncryptionKey: () => Promise<void>;
}
const SecuredRealmContext = createContext<SecuredRealmProps>({
  wipeEncryptionKey: () => Promise.resolve(),
});

export const SecuredRealmProvider = ({ children }: Props) => {
  const [isEncrypted, setIsEncrypted] = useState<boolean>();
  const [realmEncryptionKey, setRealmEncryptionKey] = useState<Int8Array>();

  const wipeEncryptionKey = useCallback(() => {
    const renewEncryptionKey = async () => {
      try {
        const key = await getRealmEncryptionKey();
        setRealmEncryptionKey(key);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    };
    return renewEncryptionKey();
  }, []);

  const checkPasswordAndGetEncryptionKey = useCallback(async () => {
    const isDataEncrypted = await getFromKeychain(KeychainKey.isStorageEncryptedKey);
    if (!isDataEncrypted) {
      try {
        const encryptionKey = await getRealmEncryptionKey();
        setRealmEncryptionKey(encryptionKey);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    }
    setIsEncrypted(!!isDataEncrypted);
  }, []);

  useEffect(() => {
    checkPasswordAndGetEncryptionKey();
  }, [checkPasswordAndGetEncryptionKey]);

  const onUnlock = (key: Int8Array) => {
    setRealmEncryptionKey(key);
  };

  if (isEncrypted && !realmEncryptionKey) {
    return <HomeLockScreen onUnlock={onUnlock} wipeEncryptionKey={wipeEncryptionKey} />;
  }

  if (!realmEncryptionKey) {
    return null;
  }

  return (
    <SecuredRealmContext.Provider value={{ wipeEncryptionKey }}>
      <RealmProvider encryptionKey={realmEncryptionKey}>{children}</RealmProvider>
    </SecuredRealmContext.Provider>
  );
};

export const useSecuredRealmContext = (): SecuredRealmProps => {
  const context = useContext(SecuredRealmContext);
  if (context === undefined) {
    throw new Error('useSecuredRealmContext must be used within a SecuredRealmContextProvider');
  }
  return context;
};
