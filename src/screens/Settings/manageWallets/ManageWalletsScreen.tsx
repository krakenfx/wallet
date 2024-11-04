import { noop } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';

import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { GradientScreenView } from '@/components/Gradients';
import { Menu, useMenu } from '@/components/Menu';
import { SvgIcon } from '@/components/SvgIcon';
import { BackupCompletionBadge } from '@/components/WalletBackup';
import { BackupMethodSelector } from '@/components/WalletBackup/BackupMethodSelector';
import { WalletItem } from '@/components/WalletItem';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { useAccounts } from '@/realm/accounts';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsItem, SettingsSectionHeader } from '../components';

import { WalletBackupWarning } from '../walletBackup';

import type { SettingsNavigationProps } from '../SettingsRouter';

import loc from '/loc';

export const ManageWalletsScreen = ({ navigation }: SettingsNavigationProps<'ManageWallets'>) => {
  const accounts = useAccounts();
  const { navigate } = navigation;

  const { isCloudBackupSupported, isCloudBackupSuggested, isCloudBackupCompleted, isManualBackupCompleted, isAnyBackupCompleted, isAnyBackupSuggested } =
    useWalletBackupSettings();

  useHeaderTitle(isCloudBackupSupported ? loc.settings.walletsAndBackups : loc.settings.manageWallets);

  const renderAccounts = useCallback(() => {
    return accounts.map((account, index) => {
      const isLast = index === accounts.length - 1;
      return <WalletItem account={account} isLast={isLast} key={account + ' ' + index} testID={account.accountCustomName} />;
    });
  }, [accounts]);

  const handleSecretRecoveryPhrasePress = () => {
    if (!isManualBackupCompleted) {
      navigate(isCloudBackupSupported ? Routes.SettingsDisplaySeed : Routes.SettingsWalletBackup);
    } else {
      navigate(Routes.SettingsDisplaySeed);
    }
  };

  const navigateToCloudBackup = () => {
    navigate(Routes.SettingsWalletCloudBackup);
  };

  const showCloudBackupSection = isCloudBackupSupported && isAnyBackupCompleted;

  const { isShown } = useMenu();

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isShown ? '0deg' : '180deg', { duration: 200 }) }],
  }));

  const navigateToDeleteConfirmation = () => {
    navigation.navigate(Routes.SettingsWalletCloudBackupDelete);
  };

  const backupIcon = useMemo(() => {
    if (!isAnyBackupCompleted || isCloudBackupSuggested) {
      return null;
    }
    return <BackupCompletionBadge completed={isManualBackupCompleted} />;
  }, [isAnyBackupCompleted, isCloudBackupSuggested, isManualBackupCompleted]);

  return (
    <GradientScreenView>
      <ScrollView style={styles.container}>
        {!!showCloudBackupSection && (
          <BackupMethodSelector
            key={String(isCloudBackupCompleted)}
            containerStyle={styles.cloudBackup}
            icon={<Image source={require('@/assets/images/common/iCloud.png')} />}
            onPress={navigateToCloudBackup}
            title={isCloudBackupCompleted ? loc.walletBackupSelection.backupWithICloudCompleted : loc.walletBackupSelection.backupWithICloud}
            subtitle={loc.walletBackupSelection.iCloudDescLong}
            subtitleShort={isCloudBackupCompleted ? loc.walletBackupSelection.iCloudDescCompletedShort : loc.walletBackupSelection.iCloudDescShort}
            showCompletionState
            completionIconSize={24}
            completed={isCloudBackupCompleted}
            rightElement={
              !!isCloudBackupCompleted && (
                <Menu
                  menuXOffset={12}
                  type="context"
                  items={[
                    {
                      title: loc.walletCloudBackupDelete.title,
                      icon: 'trash',
                      onPress: navigateToDeleteConfirmation,
                    },
                  ]}>
                  <SvgIcon name="chevron-up" style={chevronStyle} onPress={noop} />
                </Menu>
              )
            }
            centerIcon
          />
        )}

        {isAnyBackupCompleted && isAnyBackupSuggested && <WalletBackupWarning style={styles.backupSuggested} />}
        <SettingsSectionHeader title={loc.settings.wallets} style={[isAnyBackupSuggested && styles.walletHeaderTitle]} />
        {!isAnyBackupCompleted && <WalletBackupWarning />}
        <SettingsItem
          isHighlighted
          isFirst
          title={loc.settings.secretRecoveryPhrase}
          onPress={handleSecretRecoveryPhrasePress}
          containerStyle={styles.walletHeader}
          testID="SecretRecoveryPhraseButton">
          {backupIcon}
        </SettingsItem>
        {renderAccounts()}
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  cloudBackup: {
    marginTop: 16,
  },
  backupSuggested: {
    marginTop: 16,
  },
  walletHeaderTitle: {
    marginTop: 24,
  },
  walletHeader: {
    marginBottom: 1,
  },
});

ManageWalletsScreen.navigationOptions = navigationStyle({ headerTransparent: true });
