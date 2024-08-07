import React from 'react';

import { GradientScreenView } from '@/components/Gradients';
import { useWipeStorage } from '@/hooks/useWipeStorage';
import { navigationStyle } from '@/utils/navigationStyle';

import { DataLossWarning } from './passwordProtection/DataLossWarning';

import { biometricUnlock } from '/helpers/biometric-unlock';

export const DeleteAllDataWarningScreen = () => {
  const { wipeStorage } = useWipeStorage();

  const onResetAppHandler = async () => {
    if (await biometricUnlock()) {
      await wipeStorage();
    }
  };

  return (
    <GradientScreenView>
      <DataLossWarning onResetApp={onResetAppHandler} />
    </GradientScreenView>
  );
};

DeleteAllDataWarningScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
