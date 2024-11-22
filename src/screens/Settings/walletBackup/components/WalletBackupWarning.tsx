import type { StyleProp, ViewStyle } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { StyleSheet } from 'react-native';

import { CardWarning } from '@/components/CardWarning';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { Routes } from '@/Routes';

import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';

import loc from '/loc';

interface Props {
  style?: StyleProp<ViewStyle>;
  showDismissable?: boolean;
}

export const WalletBackupWarning = ({ style, showDismissable = true }: Props) => {
  const {
    isManualBackupCompleted,
    isCloudBackupSuggested,
    setCloudBackupDismissed,
    setManualBackupDismissed,
    isCloudBackupSupported,
    isAnyBackupCompleted,
    isManualBackupSuggested,
  } = useWalletBackupSettings();

  const { navigate } = useNavigation();

  if (isManualBackupCompleted && !isCloudBackupSuggested) {
    return null;
  }

  const navigateToManualBackup = () => navigate(Routes.Settings, { screen: Routes.SettingsWalletBackup });

  const navigateToBackup = () => {
    if (isCloudBackupSupported) {
      navigate(Routes.Settings, { screen: Routes.SettingsWalletBackupMethod });
    } else {
      navigate(Routes.Settings, { screen: Routes.SettingsWalletBackup, initial: false });
    }
  };

  const navigateToCloudBackup = () => {
    navigate(Routes.SettingsWalletCloudBackup);
  };

  if (!isAnyBackupCompleted) {
    return (
      <CardWarning
        title={loc.walletBackup.backupYourWallet}
        description={loc.walletBackup.backupYourWalletDescription}
        type="negative"
        buttonText={loc.walletBackup.backup}
        onPress={navigateToBackup}
        style={[styles.container, style]}
      />
    );
  }

  if (isManualBackupSuggested && showDismissable) {
    return (
      <CardWarning
        title={loc.walletBackup.manualWarning.title}
        description={loc.walletBackup.manualWarning.desc}
        type="warning"
        buttonText={loc.walletBackup.manualWarning.button}
        onPress={navigateToManualBackup}
        onClose={() => {
          safelyAnimateLayout();
          setManualBackupDismissed();
        }}
        style={[styles.container, style]}
      />
    );
  }

  if (isCloudBackupSuggested && showDismissable) {
    return (
      <CardWarning
        title={loc.walletBackup.cloudWarning.title}
        description={loc.walletBackup.cloudWarning.desc}
        type="warning"
        buttonText={loc.walletBackup.cloudWarning.button}
        onPress={navigateToCloudBackup}
        onClose={() => {
          safelyAnimateLayout();
          setCloudBackupDismissed();
        }}
        style={[styles.container, style]}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
