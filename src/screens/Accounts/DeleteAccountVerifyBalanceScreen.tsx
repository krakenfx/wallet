import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useManageAccount } from '@/hooks/useManageAccount';
import { useAccountById } from '@/realm/accounts';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useRealmWallets } from '@/realm/wallets/useWallets';
import { formatCurrency } from '@/utils/formatCurrency';
import { navigationStyle } from '@/utils/navigationStyle';

import type { AccountNavigationProps } from './AccountRouter';

import loc from '/loc';

export interface DeleteAccountVerifyBalanceParams {
  accountNumber: number;
}

export const DeleteAccountVerifyBalanceScreen = ({ route, navigation }: AccountNavigationProps<'DeleteAccountVerifyBalance'>) => {
  const { accountNumber } = route.params;
  const account = useAccountById(accountNumber);
  const balance = account?.balance ?? 0;
  const accountWallets = useRealmWallets(false, accountNumber);
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { currency, currencyInfo } = useAppCurrency();

  const [userBalance, setUserBalance] = useState('');
  const { removeAccount } = useManageAccount();

  const handleTextChange = (value: string) => {
    setUserBalance(value.replace(',', '.'));
  };

  const handleDelete = () => {
    close();
    removeAccount(accountNumber, accountWallets);
  };

  const balanceFooter = useMemo(() => {
    return `${loc.deleteAccountVerifyBalance.balanceLabel} ${formatCurrency(balance, { currency })}`;
  }, [balance, currency]);

  const rightElement = useMemo(() => <Label type="boldDisplay4"> {currencyInfo.symbol}</Label>, [currencyInfo.symbol]);

  const deleteEnabled = formatCurrency(balance, { currency }) === formatCurrency(Number(userBalance), { currency });

  return (
    <BottomSheet {...bottomSheetProps} snapPoints={['100%']}>
      <ModalNavigationHeader title={loc.deleteAccountConfirm.title} onClosePress={close} />

      <View style={styles.container}>
        <Label type="boldDisplay4" style={styles.header}>
          {loc.deleteAccountVerifyBalance.header}
        </Label>
        <Label type="regularTitle1" color="light75">
          {loc.deleteAccountVerifyBalance.caption}
        </Label>
        <View style={styles.inputContainer}>
          <Label style={styles.inputLabel}>{loc.deleteAccountVerifyBalance.inputLabel}</Label>
          <Input
            autoFocus
            onChangeText={handleTextChange}
            value={userBalance}
            style={styles.input}
            maxLength={10}
            type="boldDisplay4"
            keyboardType="numeric"
            footerRight={balanceFooter}
            right={rightElement}
            shrinkInput
            testID="DeleteAccountVerifyInput"
          />
        </View>
      </View>
      <FloatingBottomContainer noAbsolutePosition>
        <View style={styles.buttonContainer}>
          <Button
            text={loc.deleteAccountVerifyBalance.cancel}
            onPress={close}
            style={styles.cancelButton}
            size="large"
            testID="ConfirmDeleteAccountCancelButton"
          />
          <Button
            text={loc.deleteAccountVerifyBalance.delete}
            onPress={handleDelete}
            disabled={!deleteEnabled}
            style={styles.deleteButton}
            size="large"
            color="red400"
            testID="ConfirmDeleteAccountConfirmButton"
          />
        </View>
      </FloatingBottomContainer>
    </BottomSheet>
  );
};

DeleteAccountVerifyBalanceScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginTop: 8,
  },
  inputLabel: {
    marginTop: 12,
  },
  input: {
    minHeight: 97,
    marginTop: 12,
  },
  header: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 4,
  },
  cancelButton: {
    flex: 1,
    marginRight: 4,
  },
});
