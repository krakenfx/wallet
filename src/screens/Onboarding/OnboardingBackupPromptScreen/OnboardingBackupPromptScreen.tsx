import LottieView from 'lottie-react-native';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/BackButton';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { LargeHeaderPage } from '@/components/LargeHeaderPage';
import { useWipeStorage } from '@/hooks/useWipeStorage';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';
import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { SkipWarningSheet } from './SkipWarningSheet';

import type { OnboardingNavigationProps } from '../OnboardingRouter';

import loc from '/loc';

export const OnboardingBackupPromptScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingBackupPrompt'>) => {
  const { wipeStorage } = useWipeStorage();

  const skipWarningSheet = useRef<BottomSheetModalRef>(null);
  const dismissWarning = () => skipWarningSheet.current?.close();
  const showSkipWarning = useCallback(() => skipWarningSheet.current?.present(), []);

  const onSkip = useCallback(() => {
    dismissWarning();
    navigation.navigate(Routes.OnboardingSecureWallet);
  }, [navigation]);

  const onContinue = useCallback(() => {
    navigation.navigate(Routes.OnboardingBackup);
  }, [navigation]);

  const handleBackAction = useCallback(async () => {
    await wipeStorage();
    navigation.popToTop();
  }, [navigation, wipeStorage]);

  useAndroidBackButton(() => {
    handleBackAction();
    return true;
  });

  const headerLeft = useCallback(() => <BackButton onPress={handleBackAction} />, [handleBackAction]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerLeft });
  }, [headerLeft, navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        progress={1}
        source={require('../assets/creatingWalletAnimation.json')}
        resizeMode="cover"
        autoPlay={false}
        loop={false}
        style={StyleSheet.absoluteFill}
      />
      <LargeHeaderPage
        testID="OnboardingBackupPrompt"
        title={loc.onboarding_backup_prompt.title}
        subtitle={loc.onboarding_backup_prompt.subtitle}
        text={loc.formatString(loc.onboarding_backup_prompt.caption, {
          recoveryPhrase: (
            <Label type="boldTitle1" color="light50">
              {loc.onboarding_backup_prompt.recovery_phrase}
            </Label>
          ),
          neverShare: (
            <Label type="boldTitle1" color="light50">
              {loc.onboarding.never_share}
            </Label>
          ),
        })}
      />

      <FloatingBottomButtons
        primary={{
          text: loc.onboarding_backup_prompt.continue,
          testID: 'RevealPhraseButton',
          onPress: onContinue,
        }}
        secondary={{
          text: loc.onboarding_backup_prompt.skip,
          testID: 'SkipButton',
          onPress: showSkipWarning,
        }}
      />
      <SkipWarningSheet ref={skipWarningSheet} onCancel={dismissWarning} onConfirm={onSkip} />
    </View>
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

OnboardingBackupPromptScreen.navigationOptions = navigationStyle({
  headerShown: true,
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
  },
  title: '',
  gestureEnabled: false,
  animation: 'fade',
});
