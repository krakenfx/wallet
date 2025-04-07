import { SecurityLevel } from 'expo-local-authentication';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { GradientScreenView } from '@/components/Gradients';
import { MissingBiometricsSheet } from '@/components/MissingBiometricsSheet';
import { useAuthType } from '@/hooks/useAuthType';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useKrakenConnectClear } from '@/hooks/useKrakenConnectClear';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsCheckItem, SettingsCheckItemsBox, SettingsInfoBox, SettingsSwitch } from '../components';

import { useIsAppLockUsed } from './hooks/useIsAppLockUsed';

import { SECURITY_ENROLLED_NONE, disableBiometrics, enableBiometrics } from '/helpers/biometric-unlock';
import loc from '/loc';

export const AppLockScreen = () => {
  const { isAppLockUsed, setIsAppLockUsed } = useIsAppLockUsed();
  const [isLoading, setIsLoading] = useState(false);
  const { supportedAuth, authType } = useAuthType();
  const { API_KEY } = useKrakenConnectCredentials();
  const { clearKrakenConnect } = useKrakenConnectClear();

  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);

  useHeaderTitle(loc.appLock.title);

  const shouldProceedWithRemovingKrakenConnectKeys = () => {
    return new Promise(resolve => {
      Alert.alert(
        loc.krakenConnect.appLockWarning.title,
        loc.krakenConnect.appLockWarning.description,
        [
          { text: loc.krakenConnect.appLockWarning.ctaCancel, onPress: () => resolve(false), style: 'cancel' },
          { text: loc.krakenConnect.appLockWarning.ctaTurnOff, onPress: () => resolve(true), style: 'destructive' },
        ],
        { cancelable: false },
      );
    });
  };

  const toggleAppLock = async () => {
    if (isLoading) {
      return;
    }
    try {
      if (API_KEY && isAppLockUsed) {
        const shouldProceed = await shouldProceedWithRemovingKrakenConnectKeys();
        if (!shouldProceed) {
          return Promise.reject('AppLock not disabled');
        }
        await clearKrakenConnect();
      }
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
