import React from 'react';
import { StyleSheet } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { RealmAccount } from '@/realm/accounts';

type Props = {
  account: RealmAccount;
  sendToAccount: (account: RealmAccount) => void;
};

export const AccountReceiveItem = ({ account, sendToAccount }: Props) => {
  const onPress = () => sendToAccount(account);

  return (
    <Touchable onPress={onPress} style={styles.container} testID="WalletReceiveItem">
      <IconButton name="wallet" style={styles.icon} containerStyle={styles.iconContainer} size={24} />
      <Label type="boldTitle2">{account.accountCustomName}</Label>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconContainer: {
    borderRadius: 20,
  },
});
