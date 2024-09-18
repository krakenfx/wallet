import React, { useRef, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, StyleSheet, TextLayoutEventData } from 'react-native';

import { BottomSheetModalRef } from '@/components/BottomSheet';
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

  const openPanel = () => {
    bottomSheetModalRef.current?.present();
  };

  const name = (account?.isValid() && account.accountCustomName) || DEFAULT_ACCOUNT_NAME;

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    setIsTruncated(event.nativeEvent.lines.length > 1);
  };

  return (
    <>
      <Touchable style={styles.container} onPress={openPanel} hitSlop={{ top: 16, bottom: 16, left: 0, right: 0 }} testID="WalletSwitcher">
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    maxWidth: Dimensions.get('window').width - 180, 
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  label: {
    marginRight: 6,
  },
  labelExpanded: {
    flexGrow: 1, 
  },
});
