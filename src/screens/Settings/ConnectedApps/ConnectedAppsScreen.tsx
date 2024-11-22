import { useCameraPermissions } from 'expo-camera';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppsListItem } from '@/components/AppsListItem';
import { Button } from '@/components/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { showToast } from '@/components/Toast';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useManageAccount } from '@/hooks/useManageAccount';
import { useAccountById } from '@/realm/accounts/useAccountById';
import { useWalletConnectTopicsMutations } from '@/realm/walletConnectTopics/useWalletConnectTopicsMutations';
import { useRealmWallets } from '@/realm/wallets/useWallets';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import { showPermissionDeniedAlert } from '@/utils/cameraPermissions';
import { navigationStyle } from '@/utils/navigationStyle';

import { ActivityIndicatorView } from '../components/ActivityIndicatorView';

import { ConnectedAppsEmptyState } from './ConnectedAppsEmptyState';

import type { AppDetailsParams } from '../AppDetailsScreen';
import type { SessionTypes } from '@walletconnect/types';

import { showAlert } from '/helpers/showAlert';

import loc from '/loc';
import { WalletConnectSessionsManager } from '/modules/wallet-connect';
import { useWalletConnectActiveSessions } from '/modules/wallet-connect/hooks/useWalletConnectActiveSessions';
import { getNetworkNameFromWalletString, loopOverAllSessionNamespaceAccounts } from '/modules/wallet-connect/utils';

export const EMPTY_STATE_TEST_ID = 'Settings/ConnectedApps_empty_state_test_id';

const keyExtractor = (item: SessionTypes.Struct, index: number) => {
  return `${item.peer.metadata.name}_${index}`;
};

export type ConnectedAppsParams = {
  accountNumber: number;
};

export const ConnectedAppsScreen = ({ navigation, route }: NavigationProps<'ConnectedApps'>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useWalletConnectActiveSessions(route.params.accountNumber);
  const account = useAccountById(route.params.accountNumber);
  const { switchAccount } = useManageAccount();
  const accountWallets = useRealmWallets(false, route.params.accountNumber);
  const [_, requestPermission] = useCameraPermissions();
  const { deleteSession } = useWalletConnectTopicsMutations();

  useHeaderTitle(loc.connectedApps.list.title);

  const rightElement = useMemo(() => {
    return <SvgIcon name="chevron-right" color="light75" />;
  }, []);

  const navigateToAppDetails = useCallback(
    ({ onDisconnect, content }: AppDetailsParams) => {
      return () => {
        navigation.navigate(Routes.AppDetails, { onDisconnect, content });
      };
    },
    [navigation],
  );

  const renderItem = useCallback(
    (item: { item: SessionTypes.Struct }) => {
      const session: SessionTypes.Struct | undefined = item.item;
      const { description, icons, name, url } = session?.peer?.metadata ?? {};
      const iconUri = (icons || [])[0] ?? '';
      const items: JSX.Element[] = [];

      loopOverAllSessionNamespaceAccounts(session, (walletString, i) => {
        const network = getNetworkNameFromWalletString(walletString);

        const onPress = navigateToAppDetails({
          onDisconnect: async (confirmed: boolean) => {
            const topic = session?.topic;

            if (confirmed && topic !== undefined) {
              const errors: Error[] = [];
              await WalletConnectSessionsManager.disconnectSession(topic, {
                onSuccess: () => {
                  deleteSession(topic);
                },
              }).catch(err => {
                errors.push(err);
              });

              if (errors.length) {
                console.log('WalletConnect V2 errors:', errors);
                showToast({ type: 'error', text: loc.connectedApps.list.error_all });
              }

              setActiveSessions(Object.values(await WalletConnectSessionsManager.getAccountSessions(accountWallets)));
            }
          },
          content: {
            description: description ?? '',
            iconUri,
            name: name ?? '',
            network,
            url: url ?? '',
          },
        });

        items.push(
          <AppsListItem
            iconUri={iconUri}
            name={name || url || ''}
            network={network}
            onPress={onPress}
            rightElement={rightElement}
            key={`${walletString}_${i}`}
          />,
        );
      });

      return <>{items}</>;
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountWallets, navigateToAppDetails, rightElement, setActiveSessions],
  );

  const deleteAll = useCallback(
    async () => {
      setIsLoading(true);
      if (!(await showAlert())) {
        setIsLoading(false);
        return;
      }

      const errors: Error[] = [];
      await Promise.all(
        activeSessions.map(session => {
          return WalletConnectSessionsManager.disconnectSession(session.topic, {
            onSuccess: () => {
              deleteSession(session.topic);
            },
          }).catch(err => {
            errors.push(err);
          });
        }),
      ).catch(err => {
        console.log(err);
      });

      if (errors.length) {
        console.log('WalletConnect V2 errors:', errors);
        showToast({ type: 'error', text: loc.connectedApps.list.error_all });
      }

      setActiveSessions(Object.values(await WalletConnectSessionsManager.getAccountSessions(accountWallets)));
      setIsLoading(false);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountWallets, activeSessions, setActiveSessions],
  );

  const onConnectToAppPress = useCallback(async () => {
    const result = await requestPermission();
    if (result.granted) {
      switchAccount(route.params.accountNumber);
      navigation.navigate(Routes.ConnectAppQRScan, { successRoute: Routes.Home });
    } else {
      showPermissionDeniedAlert();
    }
  }, [navigation, requestPermission, route.params.accountNumber, switchAccount]);

  const content = isLoading ? (
    <ActivityIndicatorView />
  ) : (
    <>
      {activeSessions.length ? (
        <>
          <Label type="boldTitle2" color="light50" style={styles.accountCustomName}>
            {account?.accountCustomName ?? ''}
          </Label>
          <FlatList
            data={activeSessions}
            automaticallyAdjustContentInsets
            contentInsetAdjustmentBehavior="automatic"
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <ConnectedAppsEmptyState testID={EMPTY_STATE_TEST_ID} />
        </View>
      )}
      <FloatingBottomContainer>
        {activeSessions.length ? (
          <Button
            text={loc.formatString(loc.connectedApps.list.disconnect_all, `${activeSessions.length}`)}
            size="large"
            onPress={deleteAll}
            style={styles.bottomButton}
            textColor="red400"
          />
        ) : (
          <Button text={loc.connectedApps.list.connect_to_app} size="extraLarge" onPress={onConnectToAppPress} style={styles.bottomButton} color="kraken" />
        )}
      </FloatingBottomContainer>
    </>
  );

  return <GradientScreenView>{content}</GradientScreenView>;
};

const styles = StyleSheet.create({
  accountCustomName: {
    marginLeft: 24,
    marginTop: 26,
    marginBottom: 12,
  },
  emptyStateContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    top: -64,
  },
  header: {
    marginBottom: 36,
  },
  bottomButton: {
    marginHorizontal: 24,
  },
});

ConnectedAppsScreen.navigationOptions = navigationStyle({
  title: loc.connectedApps.list.title,
  headerTransparent: true,
  headerTitleStyle: {
    fontSize: 19,
  },
});
