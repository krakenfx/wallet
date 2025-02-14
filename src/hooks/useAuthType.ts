import { AuthenticationType, SecurityLevel } from 'expo-local-authentication';
import { useEffect, useMemo, useState } from 'react';

import { Platform } from 'react-native';

import { getSupportedAuthentication } from '/helpers/biometric-unlock';
import loc from '/loc';

export const useAuthType = () => {
  const [supportedAuth, setSupportedAuth] = useState<Awaited<ReturnType<typeof getSupportedAuthentication>>>();

  useEffect(() => {
    async function getAvailableTypes() {
      const auth = await getSupportedAuthentication();
      setSupportedAuth(auth);
    }
    getAvailableTypes();
  }, []);

  const authType = useMemo(() => {
    if (supportedAuth) {
      const { securityLevelEnrolled, authenticationTypes } = supportedAuth;
      switch (securityLevelEnrolled) {
        case SecurityLevel.SECRET:
          return loc.appLock.authType.passcode;
        case SecurityLevel.BIOMETRIC_STRONG:
        case SecurityLevel.BIOMETRIC_WEAK:
        case SecurityLevel.NONE: {
          if (Platform.OS === 'ios' && authenticationTypes.length === 1) {
            switch (authenticationTypes[0]) {
              case AuthenticationType.FACIAL_RECOGNITION:
                return loc.appLock.authType.faceId;
              case AuthenticationType.FINGERPRINT:
                return loc.appLock.authType.touchId;
            }
          }
        }
      }
    }
    return loc.appLock.authType.generic;
  }, [supportedAuth]);

  return { authType, supportedAuth };
};
