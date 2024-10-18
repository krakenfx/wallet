import { BottomSheetFlatList, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { StackActions, useNavigation } from '@react-navigation/native';
import { SessionTypes } from '@walletconnect/types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppsListItem } from '@/components/AppsListItem';
import { BottomSheetModal, BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useBrowser } from '@/hooks/useBrowser';
import { useCurrentAccountNumber } from '@/realm/accounts';
import { Routes } from '@/Routes';

import { EmptyState } from './EmptyState';

import loc from '/loc';
import { useWalletConnectActiveSessions } from '/modules/wallet-connect/hooks/useWalletConnectActiveSessions';
import { getNetworkNameFromWalletString, loopOverAllSessionNamespaceAccounts } from '/modules/wallet-connect/utils';

export const LIST_ITEM_TEST_ID = 'ConnectedApps_list_item_test_id';
export const EMPTY_STATE_TEST_ID = 'ConnectedApps_empty_state_test_id';

const keyExtractor = (item: SessionTypes.Struct, index: number) => {
  return `${item.peer.metadata.name}_${index}`;
};

type ConnectedAppsProps = Pick<BottomSheetModalProps, 'footerComponent'> & { minHeight: number };

export const ConnectedApps = forwardRef<BottomSheetModalRef, ConnectedAppsProps>(({ footerComponent, minHeight }, bottomSheetModalRef) => {
  const currentAccountNumber = useCurrentAccountNumber();
  const [activeSessions] = useWalletConnectActiveSessions(currentAccountNumber);

  const { openURL } = useBrowser();

  const navigation = useNavigation();
  const rightElement = useMemo(() => {
    return <SvgIcon name="open-external" />;
  }, []);

  const renderItem = useCallback(
    (item: { item: SessionTypes.Struct }) => {
      const session: SessionTypes.Struct | undefined = item.item;
      const { icons, name, url } = session?.peer?.metadata ?? {};
      const onPress = () => url && openURL(url);
      const iconUri = (icons || [])[0] ?? '';
      const items: JSX.Element[] = [];

      loopOverAllSessionNamespaceAccounts(session, (account, i) => {
        
        const network = getNetworkNameFromWalletString(account);

        items.push(
          <AppsListItem
            iconUri={iconUri}
            name={name || url || ''}
            network={network}
            onPress={onPress}
            rightElement={rightElement}
            key={`${account}_${i}`}
            testID={LIST_ITEM_TEST_ID}
          />,
        );
      });

      return <>{items}</>;
    },
    [rightElement],
  );

  const paddingBottom = useBottomSheetPadding();

  const renderFooter = () => <View style={{ height: paddingBottom }} />;

  const renderHeader = () =>
    activeSessions.length ? (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Label type="boldDisplay4">{loc.scan.apps}</Label>
          <Button
            onPress={() => {
              navigation.dispatch(StackActions.replace(Routes.ConnectedApps, { accountNumber: currentAccountNumber }));
            }}
            text={loc.scan.manage}
          />
        </View>
      </View>
    ) : null;

  const snapPoints = activeSessions.length ? [minHeight, '100%'] : [minHeight];

  return (
    <BottomSheetModal
      animateOnMount
      noBackdrop
      footerComponent={footerComponent}
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      dismissible={false}
      handleAndroidBackButton={false}>
      {activeSessions.length ? (
        <BottomSheetFlatList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          data={activeSessions}
          automaticallyAdjustContentInsets
          contentInsetAdjustmentBehavior="automatic"
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      ) : (
        <EmptyState testID={EMPTY_STATE_TEST_ID} />
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    margin: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
