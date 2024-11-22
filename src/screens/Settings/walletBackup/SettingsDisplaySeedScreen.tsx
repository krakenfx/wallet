import { StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { SeedDisplay, useSeedPhrase } from '@/components/SeedDisplay';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsSeedScrollFooter } from './SettingsSeedScrollFooter';

import type { SettingsNavigationProps } from '../SettingsRouter';

import loc from '/loc';

export const SettingsDisplaySeedScreen = ({ navigation }: SettingsNavigationProps<'SettingsDisplaySeed'>) => {
  const { isManualBackupNeeded, isCloudBackupSupported, isCloudBackupNeeded, isAnyBackupCompleted } = useWalletBackupSettings();
  const { seed, isSeedVisible, onSeedReveal } = useSeedPhrase();

  const onCloudBackupSelected = () => navigation.navigate(Routes.SettingsWalletCloudBackup);
  const onManualBackupSelected = () => navigation.navigate(Routes.SettingsWalletBackup);

  return (
    <GradientScreenView style={styles.container}>
      <SeedDisplay
        seed={seed}
        compact={isCloudBackupSupported && (isCloudBackupNeeded || isManualBackupNeeded)}
        isSeedVisible={isSeedVisible}
        onSeedReveal={onSeedReveal}
        scrollHeader={
          <Label style={styles.header} type="boldDisplay5">
            {loc.walletBackup.secretRecoveryPhrase}
          </Label>
        }
        scrollFooter={
          <SettingsSeedScrollFooter
            isCloudBackupNeeded={isCloudBackupNeeded}
            isManualBackupNeeded={isManualBackupNeeded}
            isCloudBackupSupported={isCloudBackupSupported}
            isAnyBackupCompleted={isAnyBackupCompleted}
            onCloudBackupSelected={onCloudBackupSelected}
            onManualBackupSelected={onManualBackupSelected}
          />
        }
      />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },
  header: {
    marginLeft: 12,
    marginBottom: 12,
  },
});

SettingsDisplaySeedScreen.navigationOptions = navigationStyle({ title: '', headerTransparent: true });
