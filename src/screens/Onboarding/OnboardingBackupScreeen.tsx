import React, { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';

import { Routes } from '@/Routes';
import { BackupWallet } from '@/screens/Settings/backupWallet';

import { OnboardingNavigationProps } from './OnboardingRouter';

export const OnboardingBackupScreeen = ({ navigation }: OnboardingNavigationProps<'OnboardingBackup'>) => {
  const onContinue = useCallback(() => {
    navigation.navigate(Routes.OnboardingBackupVerify);
  }, [navigation]);
  return (
    <GradientScreenView>
      <BackupWallet onContinue={onContinue} seedVisible />
    </GradientScreenView>
  );
};

OnboardingBackupScreeen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
