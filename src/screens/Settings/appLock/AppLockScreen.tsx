import { AuthenticationType, SecurityLevel } from 'expo-local-authentication';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { GradientScreenView } from '@/components/Gradients';
import { MissingBiometricsSheet } from '@/components/MissingBiometricsSheet';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsCheckItem, SettingsCheckItemsBox, SettingsInfoBox, SettingsSwitch } from '../components';

import { useIsAppLockUsed } from './hooks/useIsAppLockUsed';

import { SECURITY_ENROLLED_NONE, disableBiometrics, enableBiometrics, getSupportedAuthentication } from '/helpers/biometric-unlock';
import loc from '/loc';

export const AppLockScreen = () => {
  const { isAppLockUsed, setIsAppLockUsed } = useIsAppLockUsed();
  const [supportedAuth, setSupportedAuth] = useState<Awaited<ReturnType<typeof getSupportedAuthentication>>>();
  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);

  useHeaderTitle(loc.appLock.title);

  useEffect(() => {
    async function getAvailableTypes() {
      const auth = await getSupportedAuthentication();
      setSupportedAuth(auth);
    }
    getAvailableTypes();
  }, []);

  const toggleAppLock = async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      if (isAppLockUsed) {
        if (await disableBiometrics()) {
          setIsAppLockUsed(false);
        } else {
          throw new Error('Failed to disable AppLock');
        }
      } else {
        if (await enableBiometrics()) {
          setIsAppLockUsed(true);
        } else {
          throw new Error('Failed to enable AppLock');
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message === SECURITY_ENROLLED_NONE) {
        bottomSheetModalRef.current?.present();
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <SettingsSwitch text={loc.appLock.turnOnAppLock} icon="lock" enabled={isAppLockUsed} onToggle={toggleAppLock} testID="TurnOnAppLock" />
        <SettingsInfoBox
          key={String(isAppLockUsed)}
          text={isAppLockUsed ? loc.appLock.appLockIsRequiredWhen : loc.formatString(loc.appLock.description, { authType })}
          boldText={!isAppLockUsed ? loc.appLock.whatIs : undefined}
        />

        <SettingsCheckItemsBox>
          <SettingsCheckItem name={loc.appLock.sendCryptoAndNfts} enabled={isAppLockUsed} />
          <SettingsCheckItem name={loc.appLock.viewSecret} enabled={isAppLockUsed} />
          <SettingsCheckItem name={loc.appLock.signTransactions} enabled={isAppLockUsed} />
          <SettingsCheckItem name={loc.appLock.authSignConnectedApps} enabled={isAppLockUsed} />
          <SettingsCheckItem name={loc.appLock.openTheApp} enabled={isAppLockUsed} />
        </SettingsCheckItemsBox>
        {supportedAuth?.securityLevelEnrolled === SecurityLevel.NONE && (
          <MissingBiometricsSheet ref={bottomSheetModalRef} authenticationTypes={supportedAuth?.authenticationTypes ?? []} />
        )}
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 14,
    paddingHorizontal: 12,
  },
});

AppLockScreen.navigationOptions = navigationStyle({ title: loc.appLock.title, headerTransparent: true });
