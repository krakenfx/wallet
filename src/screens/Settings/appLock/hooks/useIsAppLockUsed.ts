import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { isBiometricEnabled } from '/helpers/biometric-unlock';

export const useIsAppLockUsed = () => {
  const [isAppLockUsed, setIsAppLockUsed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkIfBiometricEnabled = async () => {
        const value = await isBiometricEnabled();
        setIsAppLockUsed(value);
      };
      checkIfBiometricEnabled();
    }, []),
  );
  return { isAppLockUsed, setIsAppLockUsed };
};
