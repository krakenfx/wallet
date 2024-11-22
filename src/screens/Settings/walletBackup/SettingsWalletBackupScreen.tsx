import { useCallback } from 'react';

import { GradientScreenView } from '@/components/Gradients';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { WalletBackup } from './components';

import type { SettingsNavigationProps } from '../SettingsRouter';

export const SettingsWalletBackupScreen = ({ navigation }: SettingsNavigationProps<'SettingsWalletBackup'>) => {
  const onContinue = useCallback(() => {
    navigation.navigate(Routes.SettingsBackupVerify);
  }, [navigation]);
  return (
    <GradientScreenView>
      <WalletBackup onContinue={onContinue} />
    </GradientScreenView>
  );
};

SettingsWalletBackupScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
