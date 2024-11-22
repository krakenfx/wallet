import { StyleSheet } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import type { RealmAccount } from '@/realm/accounts';

type Props = {
  account: RealmAccount;
  sendToAccount: (account: RealmAccount) => void;
};

export const AccountReceiveItem = ({ account, sendToAccount }: Props) => {
  const onPress = () => sendToAccount(account);

  return (
    <Touchable onPress={onPress} style={styles.container} testID="WalletReceiveItem">
      <AvatarIcon accountNumber={account.accountNumber} accountAvatar={account.avatar} />
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
});
