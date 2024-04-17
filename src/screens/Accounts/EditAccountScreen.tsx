import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import navigationStyle from '@/components/navigationStyle';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useAccountById, useAccountsMutations } from '@/realm/accounts';

import { AccountNavigationProps } from './AccountRouter';

import loc from '/loc';

export interface EditAccountParams {
  accountNumber: number;
}

export const EditAccountScreen = ({ route, navigation }: AccountNavigationProps<'EditAccount'>) => {
  const { accountNumber } = route.params;
  const account = useAccountById(accountNumber);
  const { editAccountCustomName } = useAccountsMutations();
  const [tempAccountName, setTempAccountName] = useState(account?.accountCustomName);

  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);

  const handleTextChange = (value: string) => {
    setTempAccountName(value);
  };

  const handleSave = () => {
    if (tempAccountName) {
      editAccountCustomName(accountNumber, tempAccountName.trim());
      close();
    }
  };

  return (
    <BottomSheet {...bottomSheetProps} snapPoints={['100%']}>
      <ModalNavigationHeader title={loc.editAccount.title} onClosePress={close} />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Label type="boldTitle2" style={styles.label}>
            {loc.editAccount.walletName}
          </Label>
          <Input
            placeholder={loc.editAccount.walletName}
            autoFocus
            maxLength={30}
            onChangeText={handleTextChange}
            value={tempAccountName}
            testID="EditAccountNameInput"
          />
        </View>
      </View>
      <FloatingBottomButtons
        noAbsolutePosition
        primary={{
          disabled: !tempAccountName,
          text: loc.editAccount.save,
          onPress: handleSave,
          testID: 'EditAccountSaveButton',
        }}
      />
    </BottomSheet>
  );
};

EditAccountScreen.navigationOptions = navigationStyle({
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
  },
  inputContainer: {
    marginTop: 12,
    marginHorizontal: 24,
  },
  label: {
    marginBottom: 12,
  },
});
