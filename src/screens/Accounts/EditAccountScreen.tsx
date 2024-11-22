import { type BottomSheetBackdropProps, BottomSheetScrollView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { AvatarIcon } from '@/components/AvatarIcon';
import { Backdrop, BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useKeyboardOffset } from '@/hooks/useKeyboardOffset';
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

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

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

  const keyboardOffset = useKeyboardOffset();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboardOffset.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: keyboardOffset.value }],
    };
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <Backdrop {...props} dismissible style={animatedBackdropStyle} />,
    [animatedBackdropStyle],
  );

  return (
    <Animated.View style={[animatedStyle, styles.animatedView]}>
      <BottomSheet
        contentHeight={animatedContentHeight}
        handleHeight={animatedHandleHeight}
        snapPoints={animatedSnapPoints}
        bottomInset={16}
        detached={true}
        dismissible
        onBackdropPress={Keyboard.dismiss}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        style={styles.modal}
        {...bottomSheetProps}>
        <BottomSheetScrollView bounces={false} contentContainerStyle={styles.container} onLayout={handleContentLayout} keyboardShouldPersistTaps="handled">
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
    </Animated.View>
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
  animatedView: {
    flex: 1,
    justifyContent: 'flex-end',
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 35,
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginVertical: 28,
  },
});
