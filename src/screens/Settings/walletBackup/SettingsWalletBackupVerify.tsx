import React, { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsNavigationProps } from '../SettingsRouter';

import { WalletBackupVerify } from './components';

export const SettingsBackupVerifyScreen = ({ navigation }: SettingsNavigationProps<'SettingsBackupVerify'>) => {
  const handleVerifySuccess = useCallback(() => {
    
    navigation.pop(2);
  }, [navigation]);

  return (
    <GradientScreenView>
      <WalletBackupVerify onVerifySuccess={handleVerifySuccess} />
    </GradientScreenView>
  );
};

SettingsBackupVerifyScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
