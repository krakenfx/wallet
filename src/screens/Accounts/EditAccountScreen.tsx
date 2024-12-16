import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { KeyboardAvoider } from '@/components/Keyboard';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useAccountById, useAccountsMutations } from '@/realm/accounts';
import { navigationStyle } from '@/utils/navigationStyle';

import type { AccountNavigationProps } from './AccountRouter';

import loc from '/loc';

export interface EditAccountParams {
  accountNumber: number;
}

export const EditAccountScreen = ({ route, navigation }: AccountNavigationProps<'EditAccount'>) => {
  const { accountNumber } = route.params;
  const account = useAccountById(accountNumber);
  const { editAccountCustomName } = useAccountsMutations();
  const [tempAccountName, setTempAccountName] = useState(account?.accountCustomName);

  const { close, bottomSheetProps } = useBottomSheetScreenProps(navigation);

  const handleTextChange = (value: string) => {
    setTempAccountName(value);
  };

  const handleRename = () => {
    if (tempAccountName && tempAccountName !== account?.accountCustomName) {
      editAccountCustomName(accountNumber, tempAccountName.trim());
    }
  };

  const handleSave = () => {
    handleRename();
    Keyboard.dismiss();
    close();
  };

  const renameButton = (
    <Button text={loc.editAccount.rename} onPress={handleRename} disabled={!tempAccountName || tempAccountName === account?.accountCustomName} />
  );

  const bottom = useBottomElementSpacing();

  return (
    <KeyboardAvoider style={styles.flex} useBottomInset={false}>
      <View style={styles.flex}>
        <BottomSheet
          enableDynamicSizing
          detached={true}
          dismissible
          bottomInset={bottom}
          onBackdropPress={Keyboard.dismiss}
          handleComponent={null}
          style={styles.modal}
          {...bottomSheetProps}>
          <BottomSheetScrollView bounces={false} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarContainer}>
              <AvatarIcon accountNumber={accountNumber} accountAvatar={account.avatar} avatarSize={76} />
            </View>
            <View style={styles.inputContainer}>
              <Input
                placeholder={loc.editAccount.walletName}
                maxLength={30}
                onChangeText={handleTextChange}
                value={tempAccountName}
                right={renameButton}
                testID="EditAccountNameInput"
              />
            </View>
            <Button size="large" color="kraken" text={loc.editAccount.save} disabled={!tempAccountName} onPress={handleSave} testID={'EditAccountSaveButton'} />
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </KeyboardAvoider>
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
  flex: {
    flex: 1,
  },
  modal: {
    borderRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    marginHorizontal: 24,
  },
  avatarContainer: {
    marginTop: 35,
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 35,
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginVertical: 28,
  },
});
