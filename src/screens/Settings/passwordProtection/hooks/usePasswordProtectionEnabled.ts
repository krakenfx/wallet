import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { KeychainKey, getFromKeychain } from '@/secureStore/keychain';

type PasswordProtection = {
  seedEncrypted: boolean;
  storageEncrypted: boolean;
};

export const usePasswordProtectionEnabled = () => {
  const [passwordProtection, setPasswordProtection] = useState<PasswordProtection>({ seedEncrypted: false, storageEncrypted: false });
  useFocusEffect(
    useCallback(() => {
      const checkIfEncrypted = async () => {
        const seedEncrypted = !!(await getFromKeychain(KeychainKey.isSeedEncryptedKey));
        const storageEncrypted = !!(await getFromKeychain(KeychainKey.isStorageEncryptedKey));
        setPasswordProtection({ seedEncrypted, storageEncrypted });
      };
      checkIfEncrypted();
    }, []),
  );

  const data = useMemo(
    () => ({
      ...passwordProtection,
      encryptionEnabled: !!passwordProtection?.seedEncrypted || !!passwordProtection?.storageEncrypted,
    }),
    [passwordProtection],
  );

  return data;
};
