import { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { GradientScreenView } from '@/components/Gradients';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { ImportSubWallets } from './ImportSubWallets';
import { LoadingSubWallets } from './LoadingSubWallets';
import { useFetchSubWallets } from './useFetchSubWallets';

import type { OnboardingNavigationProps } from '../OnboardingRouter';

import loc from '/loc';

export const OnboardingImportSubWalletsScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingImportSubWallets'>) => {
  const { isLoadingSubWallets, subWallets } = useFetchSubWallets();
  const skipImportSubWallets = useCallback(() => {
    navigation.navigate(Routes.OnboardingSecureWallet);
  }, [navigation]);
  const headerRight = useCallback(
    () =>
      isLoadingSubWallets ? (
        <Button text={loc.onboardingImportSubWallets.importSubWallets.skip} testID="SkipImportSubWalletsButton" onPress={skipImportSubWallets} />
      ) : null,
    [isLoadingSubWallets, skipImportSubWallets],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [headerRight, navigation]);

  return (
    <GradientScreenView>
      {isLoadingSubWallets ? (
        <Animated.View exiting={FadeOut.duration(1000)} style={styles.flex}>
          <LoadingSubWallets subWalletsCount={subWallets.length} />
        </Animated.View>
      ) : (
        <ImportSubWallets subWallets={subWallets} />
      )}
    </GradientScreenView>
  );
};

OnboardingImportSubWalletsScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
