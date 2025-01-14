import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { GradientScreenView } from '@/components/Gradients';
import { useDelayEffect } from '@/hooks/useDelayEffect';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { ImportSubWallets } from './ImportSubWallets';
import { LoadingSubWallets } from './LoadingSubWallets';
import { useFetchSubWallets } from './useFetchSubWallets';
import { fetchSubWalletByAccountCache } from './useFetchSubWallets/fetchSubWalletByAccountCache';

import type { OnboardingNavigationProps } from '../OnboardingRouter';

import loc from '/loc';

export const OnboardingImportSubWalletsScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingImportSubWallets'>) => {
  const { isLoadingSubWallets, subWallets } = useFetchSubWallets();
  const [isLoadingSubWalletsDelayed, setIsLoadingSubWalletsDelayed] = useState(true);

  useDelayEffect(
    () => {
      setIsLoadingSubWalletsDelayed(isLoadingSubWallets);
    },
    [isLoadingSubWallets],
    1000,
  );

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

  useLayoutEffect(
    function setSkipImportSubWalletsButton() {
      navigation.setOptions({ headerRight });
    },
    [headerRight, navigation],
  );

  useEffect(function resetAddByIndexCache() {
    Object.keys(fetchSubWalletByAccountCache).forEach(k => {
      delete fetchSubWalletByAccountCache[k];
    });
  }, []);

  return (
    <GradientScreenView>
      {isLoadingSubWalletsDelayed ? (
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
  headerLeft: () => null,
  headerBackVisible: false,
  gestureEnabled: false,
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
