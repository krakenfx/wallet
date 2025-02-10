import type { FC } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useCallback, useEffect, useState } from 'react';

import { ExploreTabBar } from '@/components/ExploreTabBar';
import { useGlobalState } from '@/components/GlobalState';

import { useOnScanPress } from '@/hooks/useOnScanPress';
import { Routes } from '@/Routes';

import { useFeatureFlag } from '@/unencrypted-realm/featureFlags/useFeatureFlag';

import type { NavigationState } from '@react-navigation/native';

const getRouteFromState = (state: NavigationState): string => {
  const routes = state?.routes ?? [];
  return routes[routes.length - 1]?.name ?? '';
};

const ALLOWED_ROUTES = [Routes.Home, Routes.Explore, Routes.ExploreSubpage, Routes.Earn];

export const ExploreNavigator: FC = () => {
  const navigation = useNavigation();
  const [currentRoute, setCurrentRoute] = useState<string>(getRouteFromState(navigation.getState()));
  const [showNavTabs, setShowNavTabs] = useGlobalState('showNavTabs');
  const [canShowNav, setCanShowNav] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isEarnEnabled] = useFeatureFlag('earnEnabled');

  const onScanPress = useOnScanPress();

  const onWalletPress = useCallback(() => {
    navigation.navigate(Routes.Home);
    setShowNavTabs(true);
  }, [navigation, setShowNavTabs]);

  const onExplorePress = useCallback(() => {
    navigation.navigate(Routes.Explore);
    setShowNavTabs(true);
  }, [navigation, setShowNavTabs]);

  const onThirdButtonPress = useCallback(() => {
    if (isEarnEnabled) {
      navigation.navigate(Routes.Earn);
      setShowNavTabs(true);
      return;
    }

    onScanPress();
  }, [navigation, isEarnEnabled, onScanPress, setShowNavTabs]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', event => {
      setCurrentRoute(getRouteFromState(event?.data?.state));
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const isAllowed = ALLOWED_ROUTES.map((s: string) => s).includes(currentRoute);
    setCanShowNav(isAllowed);
    setShowNavTabs(isAllowed);

    const newTabIndex = getCurrentTabIndex(currentRoute, isEarnEnabled);
    setTabIndex(newTabIndex);
  }, [currentRoute, isEarnEnabled, setShowNavTabs]);

  return (
    <ExploreTabBar
      leftIconName="wallet"
      centerIconName="compass"
      rightIconName={isEarnEnabled ? 'earn' : 'scan-walletConnect'}
      onTabLeftPress={onWalletPress}
      onTabCenterPress={onExplorePress}
      onTabRightPress={onThirdButtonPress}
      activeTab={tabIndex}
      showTabs={showNavTabs && canShowNav}
    />
  );
};

function getCurrentTabIndex(currentRoute: string, isEarnEnabled: boolean) {
  if (isEarnEnabled && currentRoute === Routes.Earn) {
    return 2;
  }

  if (currentRoute === Routes.Home) {
    return 0;
  }

  return 1;
}
