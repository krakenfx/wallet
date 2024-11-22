import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { DefaultBackButton } from '@/components/BackButton';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import type { RouteProps, Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { validateSchemaVersion } from '@/utils/migrations';

import { WalletCloudBackupScreen, WalletCloudImportScreen, WalletCloudImportSelectScreen } from '../WalletCloudBackup';

import { OnboardingBackupPromptScreen, OnboardingBackupPromptScreenWithOptions } from './OnboardingBackupPromptScreen';
import { OnboardingBackupScreeen } from './OnboardingBackupScreeen';
import { OnboardingBackupVerifyScreen } from './OnboardingBackupVerifyScreen';
import { OnboardingImportMethodSelectionScreen } from './OnboardingImportMethodSelectionScreen';
import { OnboardingImportSubWalletsScreen } from './OnboardingImportSubWalletsScreen';
import { OnboardingImportSubWalletsSuccessScreen } from './OnboardingImportSubWalletsSuccessScreen';
import { OnboardingImportWalletScreen } from './OnboardingImportWalletScreen';
import { OnboardingIntroScreen } from './OnboardingIntroScreen';
import { OnboardingOutroScreen } from './OnboardingOutroScreen';
import { OnboardingPushPromptScreen } from './OnboardingPushPromptScreen';
import { OnboardingSecureWalletScreen } from './OnboardingSecureWalletScreen';

import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CloudBackupMetadata } from '/modules/cloud-backup';

export type OnboardingStackParams = {
  OnboardingIntro: undefined;
  OnboardingBackupPrompt: undefined;
  OnboardingBackup: undefined;
  OnboardingBackupVerify: undefined;
  OnboardingImportWallet: undefined;
  OnboardingImportMethodSelection: undefined;
  OnboardingWalletCloudImportSelection: {
    backups: CloudBackupMetadata[];
  };
  OnboardingImportSubWallets: undefined;
  OnboardingImportSubWalletsSuccess: {
    subWalletIds: number[];
  };
  OnboardingSecureWallet: undefined;
  OnboardingWalletCloudBackup: {
    origin: Routes.OnboardingBackupPrompt;
  };
  OnboardingWalletCloudImport:
    | {
        selectedBackup: CloudBackupMetadata;
      }
    | undefined;
  OnboardingPushPrompt: {
    hasSecuredWallet?: boolean;
  };
  OnboardingOutro: {
    hasSecuredWallet?: boolean;
  };
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParams>();
export const OnboardingRouter = () => {
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      await validateSchemaVersion();
    })();
  }, []);

  const { isCloudBackupSupported } = useWalletBackupSettings();

  return (
    <OnboardingStack.Navigator screenOptions={{ headerShadowVisible: false, headerLeft: DefaultBackButton }} initialRouteName="OnboardingIntro">
      <OnboardingStack.Screen name="OnboardingIntro" component={OnboardingIntroScreen} options={OnboardingIntroScreen.navigationOptions(theme)} />
      <OnboardingStack.Screen name="OnboardingBackup" component={OnboardingBackupScreeen} options={OnboardingBackupScreeen.navigationOptions(theme)} />
      <OnboardingStack.Screen
        name="OnboardingBackupVerify"
        component={OnboardingBackupVerifyScreen}
        options={OnboardingBackupVerifyScreen.navigationOptions(theme)}
      />
      <OnboardingStack.Screen
        name="OnboardingImportWallet"
        component={OnboardingImportWalletScreen}
        options={OnboardingImportWalletScreen.navigationOptions(theme)}
      />
      {isCloudBackupSupported ? (
        <>
          <OnboardingStack.Screen
            name="OnboardingBackupPrompt"
            component={OnboardingBackupPromptScreenWithOptions}
            options={OnboardingBackupPromptScreenWithOptions.navigationOptions(theme)}
          />
          <OnboardingStack.Screen
            name="OnboardingWalletCloudBackup"
            component={WalletCloudBackupScreen}
            options={WalletCloudBackupScreen.navigationOptions(theme)}
          />
          <OnboardingStack.Screen
            name="OnboardingImportMethodSelection"
            component={OnboardingImportMethodSelectionScreen}
            options={OnboardingImportMethodSelectionScreen.navigationOptions(theme)}
          />
          <OnboardingStack.Screen
            name="OnboardingWalletCloudImportSelection"
            component={WalletCloudImportSelectScreen}
            options={WalletCloudImportSelectScreen.navigationOptions(theme)}
          />
          <OnboardingStack.Screen
            name="OnboardingWalletCloudImport"
            component={WalletCloudImportScreen}
            options={WalletCloudImportScreen.navigationOptions(theme)}
          />
        </>
      ) : (
        <>
          <OnboardingStack.Screen
            name="OnboardingBackupPrompt"
            component={OnboardingBackupPromptScreen}
            options={OnboardingBackupPromptScreen.navigationOptions(theme)}
          />
        </>
      )}
      <OnboardingStack.Screen
        name="OnboardingImportSubWallets"
        component={OnboardingImportSubWalletsScreen}
        options={OnboardingImportSubWalletsScreen.navigationOptions(theme)}
      />
      <OnboardingStack.Screen
        name="OnboardingImportSubWalletsSuccess"
        component={OnboardingImportSubWalletsSuccessScreen}
        options={OnboardingImportSubWalletsSuccessScreen.navigationOptions(theme)}
      />
      <OnboardingStack.Screen
        name="OnboardingSecureWallet"
        component={OnboardingSecureWalletScreen}
        options={OnboardingSecureWalletScreen.navigationOptions(theme)}
      />
      <OnboardingStack.Screen
        name="OnboardingPushPrompt"
        component={OnboardingPushPromptScreen}
        options={OnboardingPushPromptScreen.navigationOptions(theme)}
      />
      <OnboardingStack.Screen name="OnboardingOutro" component={OnboardingOutroScreen} options={OnboardingOutroScreen.navigationOptions(theme)} />
    </OnboardingStack.Navigator>
  );
};

OnboardingRouter.navigationOptions = {
  presentation: 'fullScreenModal' as const,
  headerShown: false,
};

export type OnboardingNavigationProps<T extends keyof OnboardingStackParams> = CompositeScreenProps<
  NativeStackScreenProps<OnboardingStackParams, T>,
  NativeStackScreenProps<RouteProps>
>;
