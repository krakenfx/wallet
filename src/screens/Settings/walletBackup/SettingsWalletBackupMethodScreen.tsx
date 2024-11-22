import { GradientScreenView } from '@/components/Gradients';
import { BackupMethodSelectionView } from '@/components/WalletBackup';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import { navigationStyle } from '@/utils/navigationStyle';

import type { SettingsNavigationProps } from '../SettingsRouter';

export const SettingsWalletBackupMethodScreen = ({ navigation }: SettingsNavigationProps<'SettingsWalletBackupMethod'>) => {
  const navigateToManualBackup = () => navigation.navigate(Routes.SettingsWalletBackup);
  const navigateToCloudBackup = () => navigation.navigate(Routes.SettingsWalletCloudBackup);

  const navigateToExplainer = () => {
    navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.BACKUP_RECOVERABILITY });
  };

  return (
    <GradientScreenView insetHeaderHeight={false}>
      <BackupMethodSelectionView
        onShowExplainer={navigateToExplainer}
        onSkip={navigation.goBack}
        onManualBackupSelected={navigateToManualBackup}
        onCloudBackupSelected={navigateToCloudBackup}
      />
    </GradientScreenView>
  );
};

SettingsWalletBackupMethodScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
