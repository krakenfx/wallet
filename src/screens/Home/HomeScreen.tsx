import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';
import { RefreshControlScrollView } from '@/components/RefreshControlScrollView';
import { useAppInitTasks } from '@/hooks/useAppInitTasks';
import { usePushNotificationsRegisterRemoteNotification } from '@/hooks/usePushNotificationsRegisterRemoteNotifications';
import { useRefreshStateActions } from '@/realm/refreshManagerHooks';
import { NavigationProps } from '@/Routes';
import { useIsOnline } from '@/utils/useConnectionManager';

import { HomeAssetsPanel } from './components/HomeAssetsPanel';
import { HomeBalance } from './components/HomeBalance';
import { HomeHeaderAccountSwitch } from './components/HomeHeaderAccountSwitch';
import { HomeHeaderLeft } from './components/HomeHeaderLeft';
import { HomeHeaderRight } from './components/HomeHeaderRight';
import { RecentActivity } from './components/RecentActivity';
import { UniversalSendReceiveButtons } from './components/UniversalSendReceiveButtons';
import { WaitForAccountSwitchSettled } from './components/WaitForAccountSwitchSettled';

import { useInitWalletConnect } from '/modules/wallet-connect/hooks';

export const HomeScreen = ({ navigation }: NavigationProps<'Home'>) => {
  const isOnline = useIsOnline();

  usePushNotificationsRegisterRemoteNotification();
  useInitWalletConnect();
  useAppInitTasks();

  const { refreshAll } = useRefreshStateActions();
  const pullToRefresh = () => {
    if (isOnline) {
      refreshAll(true);
    }
  };

  return (
    <GradientScreenView>
      <View style={styles.rootView} testID="HomeScreen">
        <RefreshControlScrollView onRefresh={pullToRefresh}>
          <HomeBalance />
          <UniversalSendReceiveButtons navigation={navigation} />
          <WaitForAccountSwitchSettled>
            <RecentActivity navigation={navigation} />
          </WaitForAccountSwitchSettled>
        </RefreshControlScrollView>
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
  headerTitle: () => <HomeHeaderAccountSwitch />,
  headerRight: () => <HomeHeaderRight />,
  headerLeft: () => <HomeHeaderLeft />,
});
