import { BottomSheetFlatList, BottomSheetFlatListMethods, useBottomSheetDynamicSnapPoints, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import noop from 'lodash/noop';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';

import { cancelActiveRequests } from '@/api/base/superFetch';
import { BottomSheetModal, BottomSheetModalRef } from '@/components/BottomSheet';

import { Button, LARGE_BUTTON_SIZE } from '@/components/Button';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { showToast } from '@/components/Toast';
import { WALLET_ITEM_HEIGHT, WalletItem } from '@/components/WalletItem';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useManageAccount } from '@/hooks/useManageAccount';
import { RealmAccount, useAccounts, useCurrentAccountNumber } from '@/realm/accounts';
import { Routes } from '@/Routes';
import { WalletBackupWarning } from '@/screens/Settings/walletBackup';
import { useIsOnline } from '@/utils/useConnectionManager';

import loc from '/loc';

const creatingNewWalletEvent = 'creatingNewWallet';
export const showCreateNewWalletToast = async () =>
  showToast({
    type: 'info',
    text: loc.accountSwitch.creatingNewWallet,
    id: creatingNewWalletEvent,
    dismissMode: 'event',
    iconLottieSource: require('@/assets/lottie/refreshSpinner.json'),
  });

const ACCOUNT_SWITCH_MODAL = 'ACCOUNT_SWITCH_MODAL';

export const AccountSwitchSheet = forwardRef<BottomSheetModalRef>((_, ref) => {
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const navigation = useNavigation();
  const { createAccount, switchAccount } = useManageAccount();
  const accounts = useAccounts();
  const accountNumber = useCurrentAccountNumber();
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const bottomSpacing = useBottomElementSpacing();
  const isOnline = useIsOnline();
  const { dismiss } = useBottomSheetModal();

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const dismissModal = useCallback(() => dismiss(ACCOUNT_SWITCH_MODAL), [dismiss]);

  const handleWalletItemPress = useCallback(
    async (walletAccountNumber: number) => {
      dismissModal();
      cancelActiveRequests();
      switchAccount(walletAccountNumber);
    },
    [dismissModal, switchAccount],
  );

  useEffect(() => {
    navigation.addListener('blur', dismissModal);
    return () => navigation.removeListener('blur', dismissModal);
  }, [navigation, dismissModal]);

  const handleManagePress = () => {
    navigation.navigate(Routes.Settings, { screen: Routes.ManageWallets });
  };

  const renderItem: ListRenderItem<RealmAccount> = useCallback(
    ({ item, index }) => {
      const isFirst = index === 0;
      const isLast = index === accounts.length - 1;
      const isCurrent = accountNumber === item.accountNumber;
      const BOTTOM_LIST_MARGIN = LARGE_BUTTON_SIZE + bottomSpacing + 32;

      return (
        <>
          <WalletItem account={item} isLast={isLast} isFirst={isFirst} isCurrentAccount={isCurrent} onPress={handleWalletItemPress} backgroundType="modal" />
          {isLast && <View style={{ height: BOTTOM_LIST_MARGIN }} />}
        </>
      );
    },
    [accountNumber, accounts.length, bottomSpacing, handleWalletItemPress],
  );

  const handleCreateNewAccount = async () => {
    if (isOnline) {
      dismissModal();
      createAccount();
    }
  };

  const handleBottomSheetChange = (index: number) => {
    if (index > -1) {
      listRef.current?.scrollToIndex({ index: accounts.length - 1, viewPosition: 0 });
    }
  };

  return (
    <BottomSheetModal
      name={ACCOUNT_SWITCH_MODAL}
      contentHeight={animatedContentHeight}
      handleHeight={animatedHandleHeight}
      snapPoints={animatedSnapPoints}
      onChange={handleBottomSheetChange}
      ref={ref}>
      <View onLayout={handleContentLayout} style={styles.container}>
        <View style={styles.header} testID="ManageButtonHeader">
          <Label>{loc.accountSwitch.wallets}</Label>
          <Button text={loc.accountSwitch.manage} onPress={handleManagePress} testID="EditAccountManageButton" />
        </View>
        <WalletBackupWarning />
        <BottomSheetFlatList
          style={{ maxHeight: WALLET_ITEM_HEIGHT * 9 }}
          data={accounts}
          keyExtractor={account => String(account.accountNumber)}
          renderItem={renderItem}
          ref={listRef}
          onScrollToIndexFailed={noop}
        />
      </View>
      <FloatingBottomButtons
        primary={{
          disabled: !isOnline,
          text: loc.accountSwitch.createWallet,
          onPress: handleCreateNewAccount,
          testID: 'CreateWalletButton',
        }}
      />
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  header: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
