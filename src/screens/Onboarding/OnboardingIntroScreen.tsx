import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityIndicator } from '@/components/ActivityIndicator/ActivityIndicator';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientMask } from '@/components/Gradients';
import { SvgIcon } from '@/components/SvgIcon';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { useCreateWallet } from './hooks/useCreateWallet';

import type { OnboardingNavigationProps } from './OnboardingRouter';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

type CreateWalletState = 'loading' | 'finished';

export const OnboardingIntroScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingIntro'>) => {
  const { createWallet } = useCreateWallet();
  const [createWalletState, setCreateWalletState] = useState<CreateWalletState>();
  const [animationFinished, setAnimationFinished] = useState<boolean>(false);

  const { isCloudBackupSupported } = useWalletBackupSettings();

  const insets = useSafeAreaInsets();

  const onCreateWalletButtonPressed = async () => {
    setCreateWalletState('loading');
    try {
      await runAfterUISync(createWallet);
      setCreateWalletState('finished');
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.accountSwitch.createWalletError });
      setCreateWalletState(undefined);
    }
  };

  useEffect(() => {
    if (animationFinished && createWalletState === 'finished') {
      navigation.navigate(Routes.OnboardingBackupPrompt);
    }
  }, [animationFinished, createWalletState, navigation]);

  const onCreateAnimationEnd = (cancelled?: boolean) => {
    if (!cancelled) {
      setAnimationFinished(true);
    }
  };

  const onImportWalletButtonPressed = useCallback(() => {
    navigation.navigate(isCloudBackupSupported ? Routes.OnboardingImportMethodSelection : Routes.OnboardingImportWallet);
  }, [isCloudBackupSupported, navigation]);

  return (
    <View style={styles.container} testID="OnboardingIntroScreen">
      {createWalletState ? (
        <LottieView
          source={require('./assets/creatingWalletAnimation.json')}
          autoPlay
          loop={false}
          onAnimationFinish={onCreateAnimationEnd}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <LottieView source={require('./assets/introAnimation.json')} autoPlay loop resizeMode="cover" style={StyleSheet.absoluteFill} />
      )}
      {animationFinished && createWalletState === 'loading' && <ActivityIndicator style={styles.activityIndicator} size={48} />}

      <GradientMask style={[styles.logo, { top: 16 + insets.top }]} element={<SvgIcon name="kraken" size={36} color="kraken" />} />

      {!createWalletState && (
        <FloatingBottomButtons
          primary={{
            text: loc.onboarding.create_wallet,
            onPress: onCreateWalletButtonPressed,
            testID: 'OnboardingCreateWalletButton',
          }}
          secondary={{
            text: loc.onboarding.import_wallet,
            onPress: onImportWalletButtonPressed,
            testID: 'OnboardingImportWalletButton',
          }}
        />
      )}
    </View>
  );
};

OnboardingIntroScreen.navigationOptions = navigationStyle({
  headerShown: false,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    left: 27,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
  },
});
