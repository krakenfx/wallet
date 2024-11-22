import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { hideSplashScreen } from '@/utils/hideSplashScreen';

import { biometricUnlock } from '/helpers/biometric-unlock';
import loc from '/loc';

export const useSecureAppLock = () => {
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [retryCount, setRetryCount] = useState(1);

  const checkAppLock = useCallback(async () => {
    if (await biometricUnlock()) {
      setAppUnlocked(true);
      hideSplashScreen();
    } else {
      if (Platform.OS === 'android') {
        hideSplashScreen();
      }
      Alert.alert(loc.appLock.authenticationCancelled, loc.appLock.authenticationCancelledDescription, [
        {
          text: loc.passwordProtection.retry,
          style: 'default',
          onPress: () => setRetryCount(value => ++value),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (retryCount) {
      checkAppLock();
    }
  }, [checkAppLock, retryCount]);

  return {
    appUnlocked,
  };
};
