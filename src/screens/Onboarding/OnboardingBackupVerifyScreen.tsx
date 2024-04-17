import React, { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';

import { Routes } from '@/Routes';
import { BackupWalletVerify } from '@/screens/Settings/backupWallet';

import { OnboardingNavigationProps } from './OnboardingRouter';

export const OnboardingBackupVerifyScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingBackupVerify'>) => {
  const handleVerifySuccess = useCallback(() => {
    navigation.navigate(Routes.OnboardingSecureWallet);
  }, [navigation]);

  return (
    <GradientScreenView>
      <BackupWalletVerify onVerifySuccess={handleVerifySuccess} />
    </GradientScreenView>
  );
};

OnboardingBackupVerifyScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
