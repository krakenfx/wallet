import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientScreenView } from '@/components/Gradients';
import { LargeHeader } from '@/components/LargeHeader';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { useLanguage } from '@/realm/settings';
import { Routes } from '@/Routes';
import { CurrencyBadge } from '@/screens/Settings/currency';
import { navigationStyle } from '@/utils/navigationStyle';

import { AppLockBadge } from './appLock';
import { BuildInfo } from './BuildInfo';
import { SettingsItem, SettingsSectionHeader } from './components';
import { ManageWalletsBadge } from './manageWallets';
import { PasswordProtectionBadge } from './passwordProtection';
import { SettingsNavigationProps } from './SettingsRouter';
import { WalletBackupWarning } from './walletBackup';

import loc from '/loc';

export const SettingsScreen = ({ navigation }: SettingsNavigationProps<'SettingsRoot'>) => {
  const { navigate } = navigation;

  
  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _lang = useLanguage();

  const insets = useSafeAreaInsets();

  const { isCloudBackupSupported } = useWalletBackupSettings();

  return (
    <GradientScreenView>
      <ScrollView testID="Settings" style={styles.scroll} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <LargeHeader title={loc.settings.header} style={styles.header} testID="Settings" />

        <SettingsSectionHeader title={loc.settings.wallets} />
        <WalletBackupWarning />
        <SettingsItem
          title={isCloudBackupSupported ? loc.settings.walletsAndBackups : loc.settings.manageWallets}
          icon="wallet"
          isFirst
          isLast
          isHighlighted
          onPress={() => navigate(Routes.ManageWallets)}
          testID="ManageWalletsButton">
          <ManageWalletsBadge />
        </SettingsItem>

        <SettingsSectionHeader title={loc.settings.security} />
        <SettingsItem title={loc.settings.appLock} icon="lock" isFirst isHighlighted onPress={() => navigate(Routes.AppLock)} testID="AppLockButton">
          <AppLockBadge />
        </SettingsItem>
        <SettingsItem
          title={loc.settings.passwordProtection}
          testID="SettingsPasswordProtection"
          icon="shield"
          isLast
          isHighlighted
          onPress={() => navigate(Routes.PasswordProtection)}>
          <PasswordProtectionBadge />
        </SettingsItem>

        <SettingsSectionHeader title={loc.settings.general} />

        <SettingsItem
          title={loc.settings.pushNotifications}
          icon="notification"
          onPress={() => navigate(Routes.Notifications)}
          testID="SettingsItemPushNotifications"
        />

        <SettingsItem title={loc.settings.currency} icon="dollar" onPress={() => navigate(Routes.Currency)}>
          <CurrencyBadge />
        </SettingsItem>
        <SettingsItem title={loc.settings.language} icon="language" onPress={() => navigate(Routes.Language)} testID="LanguagesList" />
        <SettingsItem title={loc.settings.privacy} icon="user" onPress={() => navigate(Routes.Privacy)} testID="PrivacyList" />
        <SettingsItem title={loc.settings.advanced} icon="tool" onPress={() => navigate(Routes.AdvancedSettings)} testID="AdvancedList" />
        <SettingsItem title={loc.settings.support} icon="help" onPress={() => navigate(Routes.Support)} testID="SupportButton" />
        <SettingsItem title={loc.settings.about} icon="info-circle" onPress={() => navigate(Routes.About)} testID="AboutButton" />
        <BuildInfo />
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    paddingHorizontal: 12,
  },
});

SettingsScreen.navigationOptions = navigationStyle({ title: '', headerTransparent: true });
