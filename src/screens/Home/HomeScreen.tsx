import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { ScrollViewWithRefreshControl } from '@/components/ScrollerWithRefreshControl';
import { useAppInitTasks } from '@/hooks/useAppInitTasks';
import { usePushNotificationsRegisterRemoteNotification } from '@/hooks/usePushNotificationsRegisterRemoteNotifications';
import { useRefreshStateActions } from '@/realm/refreshManagerHooks';
import { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { HomeAssetsPanel } from './components/HomeAssetsPanel';
import { HomeBalance } from './components/HomeBalance';
import { HomeHeaderAccountSwitch } from './components/HomeHeaderAccountSwitch';
import { HomeHeaderRight } from './components/HomeHeaderRight';
import { RecentActivity } from './components/RecentActivity';
import { UniversalSendReceiveButtons } from './components/UniversalSendReceiveButtons';
import { WaitForAccountSwitchSettled } from './components/WaitForAccountSwitchSettled';

import { useInitWalletConnect } from '/modules/wallet-connect/hooks';


const AUTO_REFRESH_INTERVAL = 120_000;

export const HomeScreen = ({ navigation }: NavigationProps<'Home'>) => {
  const isOnline = useIsOnline();

  usePushNotificationsRegisterRemoteNotification();
  useInitWalletConnect();
  useAppInitTasks();

  const { refreshAll } = useRefreshStateActions();
  const pullToRefresh = () => {
    if (isOnline) {
      refreshAll({ showToast: 'immediately' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll({ showToast: 'none' });
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <GradientScreenView>
      <View style={styles.rootView} testID="HomeScreen">
        <ScrollViewWithRefreshControl onRefresh={pullToRefresh}>
          <HomeBalance />
          <UniversalSendReceiveButtons navigation={navigation} />
          <WaitForAccountSwitchSettled>
            <RecentActivity navigation={navigation} />
          </WaitForAccountSwitchSettled>
        </ScrollViewWithRefreshControl>
      </View>
      <HomeAssetsPanel navigation={navigation} />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

HomeScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  headerTitle: () => '',
  headerRight: () => <HomeHeaderRight />,
  headerLeft: () => <HomeHeaderAccountSwitch />,
});
