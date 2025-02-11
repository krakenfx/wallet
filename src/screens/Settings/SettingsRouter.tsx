import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DefaultBackButton } from '@/components/BackButton';
import type { RouteProps } from '@/Routes';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';

import { WalletCloudBackupDeleteScreen, WalletCloudBackupScreen } from '../WalletCloudBackup';

import { AboutScreen } from './about';
import { AdvancedSettingsScreen } from './AdvancedSettingsScreen';
import { AppLockScreen } from './appLock';
import { CurrencyScreen } from './CurrencyScreen';
import { DeleteAllDataWarningScreen } from './DeleteAllDataWarningScreen';
import { KrakenConnectDisconnectScreen } from './krakenConnect/KrakenConnectDisconnectScreen';
import { ManageConnectionsScreen } from './krakenConnect/ManageConnectionsScreen';
import { ManageWalletsScreen } from './manageWallets';
import { DisablePasswordProtectionScreen, PasswordProtectionFormScreen, PasswordProtectionScreen } from './passwordProtection';
import { PrivacyScreen } from './PrivacyScreen';
import { SettingsScreen } from './SettingsScreen';
import { SupportScreen } from './support';
import { SettingsBackupVerifyScreen, SettingsWalletBackupMethodScreen, SettingsWalletBackupScreen } from './walletBackup';
import { SettingsDisplaySeedScreen } from './walletBackup/SettingsDisplaySeedScreen';

import type { KrakenConnectNavigationParams } from '../KrakenConnect/KrakenConnectScreen';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type SettingsStackParams = {
  About: undefined;
  AdvancedSettings: undefined;
  Currency: undefined;
  SettingsRoot: undefined;
  AppLock: undefined;
  ManageWallets: undefined;
  ManageConnections: undefined;
  KrakenConnectDisconnect: KrakenConnectNavigationParams;
  PasswordProtection: undefined;
  PasswordProtectionForm: undefined;
  Privacy: undefined;
  DeleteAllDataWarningScreen: undefined;
  DisablePasswordProtection: undefined;
  SettingsWalletBackup: undefined;
  SettingsWalletBackupMethod: undefined;
  SettingsWalletCloudBackup: undefined;
  SettingsWalletCloudBackupDelete: undefined;
  SettingsBackupVerify: undefined;
  SettingsDisplaySeed: undefined;
  Support: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsStackParams>();

export const SettingsRouter = () => {
  const theme = useTheme();

  return (
    <SettingsStack.Navigator
      initialRouteName={Routes.SettingsRoot}
      screenOptions={{ headerShadowVisible: false, headerLeft: DefaultBackButton, headerBackVisible: false, headerTitleAlign: 'center' }}>
      <SettingsStack.Screen name={Routes.SettingsRoot} component={SettingsScreen} options={SettingsScreen.navigationOptions(theme)} />
      <SettingsStack.Screen name={Routes.AdvancedSettings} component={AdvancedSettingsScreen} options={AdvancedSettingsScreen.navigationOptions(theme)} />
      <SettingsStack.Screen name={Routes.AppLock} component={AppLockScreen} options={AppLockScreen.navigationOptions(theme)} />
      <SettingsStack.Screen name={Routes.ManageWallets} component={ManageWalletsScreen} options={ManageWalletsScreen.navigationOptions(theme)} />
      <SettingsStack.Screen name={Routes.ManageConnections} component={ManageConnectionsScreen} options={ManageConnectionsScreen.navigationOptions(theme)} />

      <SettingsStack.Screen
        name={Routes.KrakenConnectDisconnect}
        component={KrakenConnectDisconnectScreen}
        options={KrakenConnectDisconnectScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen name={Routes.PasswordProtection} component={PasswordProtectionScreen} options={PasswordProtectionScreen.navigationOptions(theme)} />
      <SettingsStack.Screen name={Routes.Privacy} component={PrivacyScreen} options={PrivacyScreen.navigationOptions(theme)} />
      <SettingsStack.Screen
        name={Routes.PasswordProtectionForm}
        component={PasswordProtectionFormScreen}
        options={PasswordProtectionFormScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen
        name={Routes.SettingsWalletBackupMethod}
        component={SettingsWalletBackupMethodScreen}
        options={SettingsWalletBackupMethodScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen
        name={Routes.SettingsWalletCloudBackup}
        component={WalletCloudBackupScreen}
        options={WalletCloudBackupScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen
        name={Routes.SettingsWalletCloudBackupDelete}
        component={WalletCloudBackupDeleteScreen}
        options={WalletCloudBackupDeleteScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen
        name={Routes.SettingsWalletBackup}
        component={SettingsWalletBackupScreen}
        options={SettingsWalletBackupScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen
        name={Routes.SettingsBackupVerify}
        component={SettingsBackupVerifyScreen}
        options={SettingsBackupVerifyScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen
        name={Routes.SettingsDisplaySeed}
        component={SettingsDisplaySeedScreen}
        options={SettingsDisplaySeedScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen name={Routes.Support} component={SupportScreen} options={SupportScreen.navigationOptions(theme)} />
      <SettingsStack.Screen
        name={Routes.DeleteAllDataWarningScreen}
        component={DeleteAllDataWarningScreen}
        options={DeleteAllDataWarningScreen.navigationOptions(theme)}
      />

      <SettingsStack.Screen
        name={Routes.DisablePasswordProtection}
        component={DisablePasswordProtectionScreen}
        options={DisablePasswordProtectionScreen.navigationOptions(theme)}
      />
      <SettingsStack.Screen name={Routes.About} component={AboutScreen} options={AboutScreen.navigationOptions(theme)} />
      <SettingsStack.Screen name={Routes.Currency} component={CurrencyScreen} options={CurrencyScreen.navigationOptions(theme)} />
    </SettingsStack.Navigator>
  );
};

SettingsRouter.navigationOptions = {
  headerShown: false,
};

export type SettingsNavigationProps<T extends keyof SettingsStackParams> = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParams, T>,
  NativeStackScreenProps<RouteProps>
>;
