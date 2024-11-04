import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { LargeHeaderPage } from '@/components/LargeHeaderPage';
import { BackupMethodSelector } from '@/components/WalletBackup/BackupMethodSelector';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import type { OnboardingNavigationProps } from './OnboardingRouter';

import loc from '/loc';
import { CloudBackupManager } from '/modules/cloud-backup';
import { MainGradientView } from '/modules/gradient-view';

export const OnboardingImportMethodSelectionScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingImportMethodSelection'>) => {
  const navigateToCloudImport = async () => {
    const knownBackups = await CloudBackupManager.getKnownBackups();
    if (knownBackups.length > 1) {
      navigation.navigate(Routes.OnboardingWalletCloudImportSelection, { backups: knownBackups });
    } else {
      navigation.navigate(Routes.OnboardingWalletCloudImport, knownBackups.length === 1 ? { selectedBackup: knownBackups[0] } : undefined);
    }
  };
  const navigateToManualImport = () => navigation.navigate(Routes.OnboardingImportWallet);

  return (
    <MainGradientView style={styles.container} testID="OnboardingImportWalletMethodSelection">
      <LargeHeaderPage title={loc.onboardingImportMethod.title} subtitle={loc.onboardingImportMethod.subtitle}>
        <View style={styles.selectors}>
          <BackupMethodSelector
            testID="ManualBackupSelector"
            icon={
              <IconButton
                size={24}
                name="recovery-phrase"
                style={[styles.iconSize, styles.iconRadius]}
                containerStyle={[styles.iconRadius, styles.row]}
                backgroundColor="kraken"
              />
            }
            onPress={navigateToManualImport}
            title={loc.onboardingImportMethod.methodManual.title}
            subtitle={loc.onboardingImportMethod.methodManual.desc}
          />
          <BackupMethodSelector
            icon={<Image source={require('@/assets/images/common/iCloud.png')} />}
            onPress={navigateToCloudImport}
            title={loc.onboardingImportMethod.methodICloud.title}
            subtitle={loc.onboardingImportMethod.methodICloud.desc}
          />
        </View>
      </LargeHeaderPage>
    </MainGradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectors: {
    paddingHorizontal: 12,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
  },
  iconSize: {
    width: 36,
    height: 36,
  },
  iconRadius: {
    borderRadius: 8,
  },
});

OnboardingImportMethodSelectionScreen.navigationOptions = navigationStyle({
  headerShown: true,
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
  },
  title: '',
});
