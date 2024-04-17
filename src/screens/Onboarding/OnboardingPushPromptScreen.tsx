import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientScreenView } from '@/components/Gradients';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { useSettingsMutations } from '@/realm/settings';
import { Routes } from '@/Routes';
import { useNoopAndroidBackButton } from '@/utils/useAndroidBackButton';

import navigationStyle from '../../components/navigationStyle';

import { OnboardingNavigationProps } from './OnboardingRouter';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export const OnboardingPushPromptScreen = ({ navigation, route }: OnboardingNavigationProps<'OnboardingPushPrompt'>) => {
  useNoopAndroidBackButton();

  const { setPushPromptNeeded } = useSettingsMutations();
  const insets = useSafeAreaInsets();

  const continueOnboarding = () => {
    navigation.navigate(Routes.OnboardingOutro, route.params);
  };

  const onDisallow = () => {
    setPushPromptNeeded(true);
    continueOnboarding();
  };

  const onSubscribed = () => {
    setPushPromptNeeded(false);
    continueOnboarding();
  };

  const onError = (error: unknown, permissionDenied: boolean) => {
    if (permissionDenied) {
      setPushPromptNeeded(false);
      continueOnboarding();
    } else {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  };

  return (
    <GradientScreenView>
      <PushNotificationPrompt
        onDisallow={onDisallow}
        onSubscribed={onSubscribed}
        onError={onError}
        allowButtonText={loc.pushNotificationsPrompt.allow}
        disallowButtonText={loc.pushNotificationsPrompt.skip}
        containerStyle={{ marginTop: insets.top }}
      />
    </GradientScreenView>
  );
};

OnboardingPushPromptScreen.navigationOptions = navigationStyle({
  headerShown: false,
  gestureEnabled: false,
});
