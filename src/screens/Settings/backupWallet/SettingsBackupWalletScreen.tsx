import React, { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';
import { Routes } from '@/Routes';

import { SettingsNavigationProps } from '../SettingsRouter';

import { BackupWallet } from './components';

export const SettingsBackupWalletScreen = ({ navigation }: SettingsNavigationProps<'SettingsBackupWallet'>) => {
  const onContinue = useCallback(() => {
    navigation.navigate(Routes.SettingsBackupVerify);
  }, [navigation]);
  return (
    <GradientScreenView>
      <BackupWallet onContinue={onContinue} />
    </GradientScreenView>
  );
};

SettingsBackupWalletScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
