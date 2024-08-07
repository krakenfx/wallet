import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useManageAccount } from '@/hooks/useManageAccount';
import { useAccountById } from '@/realm/accounts/useAccountById';
import { useRealmWallets } from '@/realm/wallets/useWallets';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { AccountNavigationProps } from './AccountRouter';

import { biometricUnlock } from '/helpers/biometric-unlock';
import loc from '/loc';

export interface DeleteAccountConfirmParams {
  accountNumber: number;
}

export const DeleteAccountConfirmScreen = ({ route, navigation }: AccountNavigationProps<'DeleteAccountConfirm'>) => {
  const { removeAccount } = useManageAccount();
  const accountNumber = route.params.accountNumber;
  const account = useAccountById(accountNumber);
  const accountWallets = useRealmWallets(false, accountNumber);
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);

  const handleDelete = async () => {
    if (!(await biometricUnlock())) {
      return;
    }

    const accountHasBalance = Boolean(account?.balance);
    if (!accountHasBalance) {
      removeAccount(accountNumber, accountWallets);
      close();
    } else {
      navigation.replace(Routes.DeleteAccountVerifyBalance, { accountNumber: accountNumber });
    }
  };

  return (
    <BottomSheet {...bottomSheetProps} snapPoints={['100%']}>
      <ModalNavigationHeader title={loc.deleteAccountConfirm.title} onClosePress={close} />

      <View>
        <View style={styles.headerContainer}>
          <Label type="boldDisplay4" style={styles.label}>
            {loc.deleteAccountConfirm.header}
          </Label>
          <Label type="regularTitle1">{loc.deleteAccountConfirm.caption}</Label>
        </View>
      </View>
      <FloatingBottomContainer>
        <View style={styles.buttonContainer}>
          <Button text={loc.deleteAccountConfirm.cancel} onPress={close} style={styles.cancelButton} size="large" testID="ConfirmDeleteAccountCancelButton" />
          <Button
            text={loc.deleteAccountConfirm.delete}
            onPress={handleDelete}
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

DeleteAccountConfirmScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginHorizontal: 24,
  },
  label: {
    marginBottom: 12,
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
