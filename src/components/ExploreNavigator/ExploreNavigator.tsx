import { NavigationState, useNavigation } from '@react-navigation/native';

import React, { FC, useCallback, useEffect, useState } from 'react';

import { ExploreTabBar } from '@/components/ExploreTabBar';
import { useGlobalState } from '@/components/GlobalState';

import { useOnScanPress } from '@/hooks/useOnScanPress';
import { Routes } from '@/Routes';

import { FeatureFlag, useFeatureFlagEnabled } from '@/utils/featureFlags';

const getRouteFromState = (state: NavigationState): string => {
  const routes = state?.routes ?? [];
  return routes[routes.length - 1]?.name ?? '';
};

const ALLOWED_ROUTES = [Routes.Home, Routes.Explore];

export const ExploreNavigator: FC = () => {
  const isExploreEnabled = useFeatureFlagEnabled(FeatureFlag.ExploreScreenEnabled);
  const navigation = useNavigation();
  const onScanPress = useOnScanPress();
  const [currentRoute, setCurrentRoute] = useState<string>(getRouteFromState(navigation.getState()));
  const [showNavTabs, setShowNavTabs] = useGlobalState('showNavTabs');
  const [canShowNav, setCanShowNav] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const onWalletPress = useCallback(() => {
    navigation.navigate(Routes.Home);
    setShowNavTabs(true);
  }, [navigation]);

  const onExplorePress = useCallback(() => {
    navigation.navigate(Routes.Explore);
    setShowNavTabs(true);
  }, [navigation]);

  useEffect(() => {
    let unsubscribe;
    if (isExploreEnabled) {
      unsubscribe = navigation.addListener('state', event => {
        setCurrentRoute(getRouteFromState(event?.data?.state));
      });
    }
    return unsubscribe;
  }, [navigation, isExploreEnabled]);

  useEffect(() => {
    setCanShowNav(ALLOWED_ROUTES.map((s: string) => s).includes(currentRoute));
    setTabIndex(currentRoute === Routes.Explore ? 1 : 0);
  }, [currentRoute]);

  if (!isExploreEnabled) {
    return null;
  }

  return (
    <ExploreTabBar
      leftIconName="wallet"
      centerIconName="compass"
      rightIconName="scan-walletConnect"
      onTabLeftPress={onWalletPress}
      onTabCenterPress={onExplorePress}
      onTabRightPress={onScanPress}
      activeTab={tabIndex}
      showTabs={showNavTabs && canShowNav}
    />
  );
};
