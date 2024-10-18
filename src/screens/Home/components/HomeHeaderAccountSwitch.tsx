import React, { useRef, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, StyleSheet, TextLayoutEventData, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { BottomSheetModalRef } from '@/components/BottomSheet';
import { useGlobalState } from '@/components/GlobalState';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { DEFAULT_ACCOUNT_NAME, useAccountById, useCurrentAccountNumber } from '@/realm/accounts';

import { AccountSwitchSheet } from './AccountSwitchSheet';

export const HomeHeaderAccountSwitch = () => {
  const accountNumber = useCurrentAccountNumber();
  const account = useAccountById(accountNumber);
  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [, setShowNavTabs] = useGlobalState('showNavTabs');

  const openPanel = () => {
    setShowNavTabs(false);
    bottomSheetModalRef.current?.present();
  };

  const name = (account?.isValid() && account.accountCustomName) || DEFAULT_ACCOUNT_NAME;

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    setIsTruncated(event.nativeEvent.lines.length > 1);
  };

  return (
    <>
      <Touchable style={styles.container} onPress={openPanel} hitSlop={{ top: 16, bottom: 16, left: 0, right: 0 }} testID="WalletSwitcher">
        <View style={styles.avatarContainer}>
          <AvatarIcon accountNumber={account.accountNumber} accountAvatar={account.avatar} />
        </View>
        <Label numberOfLines={1} style={[styles.label, isTruncated && styles.labelExpanded]} onTextLayout={onTextLayout}>
          {name}
        </Label>
        <SvgIcon name="chevron-down" size={16} />
      </Touchable>
      <AccountSwitchSheet ref={bottomSheetModalRef} />
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginLeft: -4,
    marginRight: 5,
    padding: 3,
    width: 38,
    height: 38,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: Dimensions.get('window').width - 140, 
    marginLeft: 27 - 18, 
    paddingRight: 16,
    flexDirection: 'row',
  },
  label: {
    marginRight: 6,
  },
  labelExpanded: {
    flexGrow: 1, 
  },
});
