import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { useBrowser } from '@/hooks/useBrowser';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';
import { useNoopAndroidBackButton } from '@/utils/useAndroidBackButton';

import { OnboardingNavigationProps } from './OnboardingRouter';

import { URLs } from '/config';
import loc from '/loc';

const MAX_ANIMATION_TIMEOUT = 6000;
const ANIMATION_TIMEOUT_WITHOUT_SECURE = 4000;

export const OnboardingOutroScreen = ({ navigation, route }: OnboardingNavigationProps<'OnboardingOutro'>) => {
  useNoopAndroidBackButton();
  const fadeIn = useSharedValue(0);
  const { openURL } = useBrowser();

  const onAnimationFinish = useCallback(() => {
    fadeIn.value = withTiming(1);
  }, [fadeIn]);

  useEffect(() => {
    
    const time = route.params.hasSecuredWallet ? MAX_ANIMATION_TIMEOUT : ANIMATION_TIMEOUT_WITHOUT_SECURE;
    setTimeout(onAnimationFinish, time);
  }, [onAnimationFinish, route.params.hasSecuredWallet]);

  const onPress = () => {
    navigation.replace(Routes.Home);
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const openLink = () => openURL(URLs.termsOfService);

  return (
    <GradientScreenView>
      <LottieView
        onAnimationFinish={onAnimationFinish}
        source={route.params.hasSecuredWallet ? require('./assets/outroAnimationSecure.json') : require('./assets/outroAnimationSkipSecure.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Animated.View style={[styles.container, contentStyle, {}]} testID="OnboardingOutroScreen">
        <View style={styles.headerSection}>
          <Label type="boldDisplay3">{loc.onboardingOutro.title}</Label>
          <Label type="regularBody" style={styles.caption}>
            {loc.onboardingOutro.caption}
          </Label>
        </View>
        <FloatingBottomContainer noAbsolutePosition>
          <Label type="regularCaption1" style={styles.termsOfService}>
            {loc.onboardingOutro.footer}
            <Label onPress={openLink} type="regularCaption1" style={styles.link}>
              {loc.onboardingOutro.termsOfService}
            </Label>
          </Label>
          <Button size="large" color="kraken" text={loc.onboardingOutro.button} onPress={onPress} testID="AgreeButton" />
        </FloatingBottomContainer>
      </Animated.View>
    </GradientScreenView>
  );
};

OnboardingOutroScreen.navigationOptions = navigationStyle({
  headerShown: false,
  gestureEnabled: false,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -120,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    textAlign: 'center',
    marginTop: 16,
  },
  termsOfService: {
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    textDecorationLine: 'underline',
  },
  lottie: {
    flex: 1.5,
  },
});
