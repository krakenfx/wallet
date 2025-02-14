import { SecurityLevel } from 'expo-local-authentication';
import LottieView from 'lottie-react-native';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { LargeHeaderPage } from '@/components/LargeHeaderPage';
import { MissingBiometricsSheet } from '@/components/MissingBiometricsSheet';
import { useAuthType } from '@/hooks/useAuthType';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import type { OnboardingNavigationProps } from './OnboardingRouter';

import { SECURITY_ENROLLED_NONE, enableBiometrics } from '/helpers/biometric-unlock';
import loc from '/loc';

export const OnboardingSecureWalletScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingSecureWallet'>) => {
  const finishOnboarding = useCallback((hasSecuredWallet?: boolean) => navigation.replace(Routes.OnboardingPushPrompt, { hasSecuredWallet }), [navigation]);

  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSecurePress = async () => {
    try {
      setIsLoading(true);
      if (await enableBiometrics()) {
        finishOnboarding(true);
      }
    } catch (e) {
      if (e instanceof Error && e.message === SECURITY_ENROLLED_NONE) {
        bottomSheetModalRef.current?.present();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = useCallback(() => finishOnboarding(false), [finishOnboarding]);

  const headerRight = useCallback(
    () => <Button disabled={isLoading} text={loc.onboarding_secure_wallet.skip} testID="SkipSecureWalletButton" onPress={handleSkip} />,
    [handleSkip, isLoading],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [headerRight, navigation]);

  const { supportedAuth, authType } = useAuthType();

  const description = supportedAuth ? loc.formatString(loc.onboarding_secure_wallet.caption, { authType }) : '';

  return (
    <GradientScreenView insetHeaderHeight={false}>
      <LargeHeaderPage
        testID="OnboardingSecureWalletPropt"
        title={loc.onboarding_secure_wallet.title}
        subtitle={loc.onboarding_secure_wallet.subtitle}
        text={description}>
        <View style={styles.imageContainer}>
          <LottieView source={require('./assets/biometricsAnimation.json')} autoPlay loop style={StyleSheet.absoluteFill} />
        </View>
      </LargeHeaderPage>
      <FloatingBottomButtons
        primary={{
          text: loc.onboarding_secure_wallet.secureWallet,
          testID: 'SecureWalletButton',
          onPress: handleSecurePress,
          loading: isLoading,
        }}
      />
      {supportedAuth?.securityLevelEnrolled === SecurityLevel.NONE && (
        <MissingBiometricsSheet ref={bottomSheetModalRef} authenticationTypes={supportedAuth?.authenticationTypes ?? []} />
      )}
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    marginTop: 24,
    marginBottom: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    alignSelf: 'center',
  },
});

OnboardingSecureWalletScreen.navigationOptions = navigationStyle({
  title: '',
  headerLeft: () => null,
  headerBackVisible: false,
  headerTransparent: true,
});
