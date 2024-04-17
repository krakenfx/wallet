import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { DefaultBackButton } from '@/components/BackButton';
import { RouteProps } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { validateSchemaVersion } from '@/utils/migrations';

import { OnboardingBackupPromptScreen } from './OnboardingBackupPromptScreen';
import { OnboardingBackupScreeen } from './OnboardingBackupScreeen';
import { OnboardingBackupVerifyScreen } from './OnboardingBackupVerifyScreen';
import { OnboardingImportWalletScreen } from './OnboardingImportWalletScreen';
import { OnboardingIntroScreen } from './OnboardingIntroScreen';
import { OnboardingOutroScreen } from './OnboardingOutroScreen';
import { OnboardingPushPromptScreen } from './OnboardingPushPromptScreen';
import { OnboardingSecureWalletScreen } from './OnboardingSecureWalletScreen';

export type OnboardingStackParams = {
  OnboardingIntro: undefined;
  OnboardingBackupPrompt: undefined;
  OnboardingBackup: undefined;
  OnboardingBackupVerify: undefined;
  OnboardingImportWallet: undefined;
  OnboardingSecureWallet: undefined;
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

  return (
    <OnboardingStack.Navigator screenOptions={{ headerShadowVisible: false, headerLeft: DefaultBackButton }} initialRouteName="OnboardingIntro">
      <OnboardingStack.Screen name="OnboardingIntro" component={OnboardingIntroScreen} options={OnboardingIntroScreen.navigationOptions(theme)} />
      <OnboardingStack.Screen
        name="OnboardingBackupPrompt"
        component={OnboardingBackupPromptScreen}
        options={OnboardingBackupPromptScreen.navigationOptions(theme)}
      />
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
