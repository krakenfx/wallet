import React, { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';

import { Routes } from '@/Routes';
import { WalletBackup } from '@/screens/Settings/walletBackup';
import { navigationStyle } from '@/utils/navigationStyle';

import type { OnboardingNavigationProps } from './OnboardingRouter';

export const OnboardingBackupScreeen = ({ navigation }: OnboardingNavigationProps<'OnboardingBackup'>) => {
  const onContinue = useCallback(() => {
    navigation.navigate(Routes.OnboardingBackupVerify);
  }, [navigation]);
  return (
    <GradientScreenView testID="OnboardingBackupScreen">
      <WalletBackup onContinue={onContinue} seedVisible />
    </GradientScreenView>
  );
};

OnboardingBackupScreeen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
