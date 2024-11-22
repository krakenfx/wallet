import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { DEFAULT_ACCOUNT_NAME, useAccountById } from '@/realm/accounts';

type Props = { accountIdx: number };
export const AccountName = ({ accountIdx }: Props) => {
  const account = useAccountById(accountIdx);

  return (
    <View style={styles.container}>
      <Label type="boldCaption1" style={styles.label}>
        {(account?.isValid() && account.accountCustomName) || DEFAULT_ACCOUNT_NAME}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 2,
  },
  label: {
    minWidth: 100,
  },
});
