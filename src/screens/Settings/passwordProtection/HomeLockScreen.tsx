import { BlurView } from '@react-native-community/blur';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { getRealmEncryptionKey } from '@/secureStore';
import { useTheme } from '@/theme/themes';
import { clearAppData } from '@/utils/clearAppData';

import { DataLossWarningScreen } from './DataLossWarningScreen';
import { useLockout } from './hooks/useLockout';

import { LockScreen } from './LockScreen';

import type { LockScreenRef } from './LockScreen';

import loc from '/loc';

interface HomeLockScreenProps {
  onUnlock: (encryptionKey: Int8Array) => void;
  wipeEncryptionKey: () => void;
}

const WIPE_STORAGE_FAILED_ATTEMPTS_LIMIT = 10;

export const HomeLockScreen = ({ onUnlock, wipeEncryptionKey }: HomeLockScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const lockScreenRef = useRef<LockScreenRef>(null);

  const { colors } = useTheme();
  const [failureCount, setFailureCount] = useState(0);
  const [dataLossInfoVisible, setDataLossInfoVisible] = useState(false);
  const [dataLossInfoWasVisible, setDataLossInfoWasVisible] = useState(false);

  const showWipeStorageInfo = useMemo(
    () => !dataLossInfoWasVisible && failureCount >= WIPE_STORAGE_FAILED_ATTEMPTS_LIMIT,
    [dataLossInfoWasVisible, failureCount],
  );

  const lockout = useLockout();

  const handleFailure = () => {
    lockout.onFailedAttempt();
    lockScreenRef.current?.showError();
    setFailureCount(prevState => ++prevState);
  };

  const handleWipeAndResetApp = async () => {
    await clearAppData();
    wipeEncryptionKey();
  };

  const handleClosePress = () => {
    setFailureCount(0);
    setDataLossInfoVisible(false);
  };

  useEffect(() => {
    if (showWipeStorageInfo) {
      setDataLossInfoWasVisible(true);
      Alert.alert(loc.passwordProtection.authFailed, loc.passwordProtection.authFailedDescription, [
        {
          text: loc.passwordProtection.retry,
          style: 'default',
          onPress: () => setFailureCount(0),
        },
        {
          text: loc.passwordProtection.wipeAndReset,
          style: 'destructive',
          onPress: () => setDataLossInfoVisible(true),
        },
      ]);
    }
  }, [dataLossInfoVisible, showWipeStorageInfo]);

  const onConfirm = async (password: string) => {
    try {
      setIsLoading(true);
      const key = await getRealmEncryptionKey(password);
      lockout.onSuccessfulAttempt();
      onUnlock(key);
    } catch (e) {
      handleFailure();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientScreenView fallbackToDefaultHeader style={styles.flex}>
      <View style={styles.flex}>
        <>
          {!dataLossInfoVisible && (
            <LockScreen
              ref={lockScreenRef}
              onConfirm={onConfirm}
              header={loc.passwordProtection.walletLocked}
              headerErrorText={loc.passwordProtection.wrongPassword}
              description={loc.passwordProtection.walletLockedDescription}
              descriptionErrorText={loc.passwordProtection.wrongPasswordDescription}
              buttonErrorText={loc.passwordProtection.passwordIncorrect}
              buttonText={loc.passwordProtection.unlock}
              buttonTestID="UnlockButton"
              isLoading={isLoading}
              isLocked={lockout.isLocked}
              disabled={!lockout.isReady}
            />
          )}
        </>
      </View>
      {Platform.OS === 'ios' && showWipeStorageInfo && !dataLossInfoVisible && (
        <BlurView blurType="ultraThinMaterialDark" blurAmount={5} reducedTransparencyFallbackColor={colors.background} style={styles.blur} />
      )}
      {dataLossInfoVisible && <DataLossWarningScreen onResetApp={handleWipeAndResetApp} onClosePress={handleClosePress} />}
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  blur: {
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
});
