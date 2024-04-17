import { AuthenticationType, SecurityLevel } from 'expo-local-authentication';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { MissingBiometricsSheet } from '@/components/MissingBiometricsSheet';
import navigationStyle from '@/components/navigationStyle';
import { Routes } from '@/Routes';

import { OnboardingIntroPage } from './components/OnboardingIntroPage';
import { OnboardingNavigationProps } from './OnboardingRouter';

import { SECURITY_ENROLLED_NONE, enableBiometrics, getSupportedAuthentication } from '/helpers/biometric-unlock';
import loc from '/loc';

export const OnboardingSecureWalletScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingSecureWallet'>) => {
  const [supportedAuth, setSupportedAuth] = useState<Awaited<ReturnType<typeof getSupportedAuthentication>>>();

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

  useEffect(() => {
    async function getAvailableTypes() {
      const auth = await getSupportedAuthentication();
      setSupportedAuth(auth);
    }
    getAvailableTypes();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [headerRight, navigation]);

  const authType = useMemo(() => {
    if (!supportedAuth) {
      return '';
    }
    const { securityLevelEnrolled, authenticationTypes } = supportedAuth;
    switch (securityLevelEnrolled) {
      case SecurityLevel.SECRET:
        return loc.onboarding_secure_wallet.authPasscode;
      case SecurityLevel.BIOMETRIC:
      case SecurityLevel.NONE: {
        if (Platform.OS === 'ios' && authenticationTypes.length === 1) {
          switch (authenticationTypes[0]) {
            case AuthenticationType.FACIAL_RECOGNITION:
              return loc.onboarding_secure_wallet.authFaceID;
            case AuthenticationType.FINGERPRINT:
              return loc.onboarding_secure_wallet.authTouchID;
          }
        }
        if (authenticationTypes.length > 0) {
          return loc.onboarding_secure_wallet.authBiometric;
        }
      }
    }
    return loc.onboarding_secure_wallet.authPasscode;
  }, [supportedAuth]);

  const description = supportedAuth ? loc.formatString(loc.onboarding_secure_wallet.caption, { authType }) : '';

  return (
    <GradientScreenView insetHeaderHeight={false}>
      <OnboardingIntroPage
        testID="OnboardingSecureWalletPropt"
        title={loc.onboarding_secure_wallet.title}
        subtitle={loc.onboarding_secure_wallet.subtitle}
        text={description}>
        <View style={styles.imageContainer}>
          <LottieView source={require('./assets/biometricsAnimation.json')} autoPlay loop style={StyleSheet.absoluteFill} />
        </View>
      </OnboardingIntroPage>
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
