import type { ListRenderItem } from 'react-native';

import { BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import noop from 'lodash/noop';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { cancelActiveRequestsAndInvalidateCache } from '@/api/base/fetchClient';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';

import { Button } from '@/components/Button';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { showToast } from '@/components/Toast';
import { WALLET_ITEM_HEIGHT, WalletItem } from '@/components/WalletItem';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useManageAccount } from '@/hooks/useManageAccount';
import type { RealmAccount } from '@/realm/accounts';
import { useAccounts, useCurrentAccountNumber } from '@/realm/accounts';
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

const keyExtractor = (account: RealmAccount) => String(account.accountNumber);

export const AccountSwitchSheet = forwardRef<BottomSheetModalRef>((_, ref) => {
  const listRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const { createAccount, switchAccount } = useManageAccount();
  const accounts = useAccounts().sorted('accountNumber');
  const accountNumber = useCurrentAccountNumber();
  const isOnline = useIsOnline();
  const { dismiss } = useBottomSheetModal();

  const currentAccountIndex = accounts.findIndex(a => a.accountNumber === accountNumber);

  const dismissModal = useCallback(() => dismiss(ACCOUNT_SWITCH_MODAL), [dismiss]);

  const handleWalletItemPress = useCallback(
    async (walletAccountNumber: number) => {
      dismissModal();
      cancelActiveRequestsAndInvalidateCache();
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

      return (
        <WalletItem account={item} isLast={isLast} isFirst={isFirst} isCurrentAccount={isCurrent} onPress={handleWalletItemPress} backgroundType="modal" />
      );
    },
    [accountNumber, accounts.length, handleWalletItemPress],
  );

  const handleCreateNewAccount = async () => {
    if (isOnline) {
      dismissModal();
      createAccount();
    }
  };

  const handleBottomSheetChange = (index: number) => {
    if (index > -1) {
      listRef.current?.scrollToIndex({ index: currentAccountIndex, animated: true });
    }
  };

  const marginBottom = useBottomSheetPadding(false);

  return (
    <BottomSheetModal enableDynamicSizing name={ACCOUNT_SWITCH_MODAL} onChange={handleBottomSheetChange} ref={ref}>
      <BottomSheetView>
        <View style={[styles.header, styles.container]} testID="ManageButtonHeader">
          <Label>{loc.accountSwitch.wallets}</Label>
          <Button text={loc.accountSwitch.manage} onPress={handleManagePress} testID="EditAccountManageButton" />
        </View>
        <View style={styles.container}>
          <WalletBackupWarning showDismissable={false} />
        </View>
        <FlatList
          style={{ marginBottom, maxHeight: 9 * WALLET_ITEM_HEIGHT }}
          data={accounts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={listRef}
          onScrollToIndexFailed={noop}
          contentContainerStyle={styles.container}
        />
      </BottomSheetView>
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
