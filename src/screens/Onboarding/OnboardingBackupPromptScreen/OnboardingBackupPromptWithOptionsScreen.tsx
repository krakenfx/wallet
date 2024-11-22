import { useCallback, useLayoutEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { BackButton } from '@/components/BackButton';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { BackupMethodSelectionView } from '@/components/WalletBackup';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { useWipeStorage } from '@/hooks/useWipeStorage';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import { navigationStyle } from '@/utils/navigationStyle';
import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { SkipWarningSheet } from './SkipWarningSheet';

import type { OnboardingNavigationProps } from '../OnboardingRouter';

import loc from '/loc';

import { MainGradientView } from '/modules/gradient-view';

export const OnboardingBackupPromptScreenWithOptions = ({ navigation }: OnboardingNavigationProps<'OnboardingBackupPrompt'>) => {
  const { wipeStorage } = useWipeStorage();
  const { isAnyBackupCompleted } = useWalletBackupSettings();

  const skipWarningSheet = useRef<BottomSheetModalRef>(null);
  const dismissWarning = () => skipWarningSheet.current?.close();
  const showSkipWarning = useCallback(() => skipWarningSheet.current?.present(), []);

  const continueOnboarding = useCallback(() => {
    dismissWarning();
    navigation.navigate(Routes.OnboardingSecureWallet);
  }, [navigation]);

  const handleSkip = useCallback(() => {
    if (isAnyBackupCompleted) {
      continueOnboarding();
    } else {
      showSkipWarning();
    }
  }, [continueOnboarding, isAnyBackupCompleted, showSkipWarning]);

  const navigateToCloudBackup = () =>
    navigation.navigate(Routes.OnboardingWalletCloudBackup, {
      origin: Routes.OnboardingBackupPrompt,
    });
  const navigateToManualBackup = () => navigation.navigate(Routes.OnboardingBackup);

  const handleBackAction = useCallback(async () => {
    await wipeStorage();
    navigation.popToTop();
  }, [navigation, wipeStorage]);

  useAndroidBackButton(() => {
    handleBackAction();
    return true;
  });

  const headerLeft = useCallback(() => <BackButton onPress={handleBackAction} />, [handleBackAction]);

  const headerRight = useCallback(() => <Button text={loc.onboarding_secure_wallet.skip} testID="SkipButton" onPress={handleSkip} />, [handleSkip]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight, headerLeft });
  }, [headerLeft, headerRight, navigation]);

  const navigateToExplainer = () => {
    navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.BACKUP_RECOVERABILITY });
  };

  return (
    <MainGradientView style={styles.container} testID="OnboardingBackupPromptWithOptions">
      <BackupMethodSelectionView
        onSkip={handleSkip}
        onShowExplainer={navigateToExplainer}
        onCloudBackupSelected={navigateToCloudBackup}
        onManualBackupSelected={navigateToManualBackup}
      />
      <SkipWarningSheet ref={skipWarningSheet} onCancel={dismissWarning} onConfirm={continueOnboarding} />
    </MainGradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  lottie: {
    position: 'absolute',
  },
});

OnboardingBackupPromptScreenWithOptions.navigationOptions = navigationStyle({
  headerShown: true,
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
  },
  title: '',
  gestureEnabled: false,
  animation: 'fade',
});
