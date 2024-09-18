import React, { useCallback, useRef, useState } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import { decryptRealmEncryptionKey, decryptSeedWithUserPassword } from '@/secureStore';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsNavigationProps } from '../SettingsRouter';

import { usePasswordProtectionEnabled } from './hooks';
import { useLockout } from './hooks/useLockout';
import { LockScreen, LockScreenRef } from './LockScreen';

import loc from '/loc';

export const DisablePasswordProtectionScreen = ({ navigation }: SettingsNavigationProps<'DisablePasswordProtection'>) => {
  const [isLoading, setIsLoading] = useState(false);
  const lockScreenRef = useRef<LockScreenRef>(null);
  const lockout = useLockout();

  const { storageEncrypted, seedEncrypted } = usePasswordProtectionEnabled();

  const onConfirm = useCallback(
    async (password: string) => {
      try {
        setIsLoading(true);
        
        if (seedEncrypted) {
          await decryptSeedWithUserPassword(password);
        }
        if (storageEncrypted) {
          await decryptRealmEncryptionKey(password);
        }
        lockout.onSuccessfulAttempt();
        navigation.goBack();
      } catch (e) {
        lockout.onFailedAttempt();
        lockScreenRef.current?.showError();
      } finally {
        setIsLoading(false);
      }
    },
    [lockout, navigation, seedEncrypted, storageEncrypted],
  );

  return (
    <GradientScreenView>
      <LockScreen
        ref={lockScreenRef}
        isLoading={isLoading}
        onConfirm={onConfirm}
        header={loc.passwordProtection.disablePassword}
        headerErrorText={loc.passwordProtection.wrongPassword}
        description={loc.passwordProtection.disablePasswordDescription}
        descriptionErrorText={loc.passwordProtection.wrongPasswordDescription}
        buttonErrorText={loc.passwordProtection.passwordIncorrect}
        buttonTestID="DisableButton"
        buttonText={loc.passwordProtection.disable}
        isLocked={lockout.isLocked}
        disabled={!lockout.isReady}
      />
    </GradientScreenView>
  );
};

DisablePasswordProtectionScreen.navigationOptions = navigationStyle({ title: '', headerTransparent: true });
