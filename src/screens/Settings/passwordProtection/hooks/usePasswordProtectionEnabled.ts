import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { KeychainKey, getFromKeychain } from '@/secureStore/keychain';

type PasswordProtection = {
  seedEncrypted: boolean;
  storageEncrypted: boolean;
};

export const usePasswordProtectionEnabled = () => {
  const [passwordProtection, setPasswordProtection] = useState<PasswordProtection>({ seedEncrypted: false, storageEncrypted: false });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const checkIfEncrypted = async () => {
        setLoading(true);

        const seedEncrypted = !!(await getFromKeychain(KeychainKey.isSeedEncryptedKey));
        const storageEncrypted = !!(await getFromKeychain(KeychainKey.isStorageEncryptedKey));

        setLoading(false);
        setPasswordProtection({ seedEncrypted, storageEncrypted });
      };

      checkIfEncrypted();
    }, []),
  );

  return useMemo(
    () => ({
      ...passwordProtection,
      encryptionEnabled: !!passwordProtection?.seedEncrypted || !!passwordProtection?.storageEncrypted,
      loading,
    }),
    [passwordProtection, loading],
  );
};
