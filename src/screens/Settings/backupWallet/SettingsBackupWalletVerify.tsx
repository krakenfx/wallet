import React, { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';

import { SettingsNavigationProps } from '../SettingsRouter';

import { BackupWalletVerify } from './components';

export const SettingsBackupVerifyScreen = ({ navigation }: SettingsNavigationProps<'SettingsBackupVerify'>) => {
  const handleVerifySuccess = useCallback(() => {
    navigation.pop(2);
  }, [navigation]);

  return (
    <GradientScreenView>
      <BackupWalletVerify onVerifySuccess={handleVerifySuccess} />
    </GradientScreenView>
  );
};

SettingsBackupVerifyScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
