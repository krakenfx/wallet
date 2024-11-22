import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import { DEFAULT_ACCOUNT_NAME, useAccountById } from '@/realm/accounts';

type Props = {
  accountIdx: number;
};

export const TransactionAccount = ({ accountIdx }: Props) => {
  const account = useAccountById(accountIdx);

  return (
    <Label type="boldCaption1" style={styles.label}>
      {(account?.isValid() && account.accountCustomName) || DEFAULT_ACCOUNT_NAME}
    </Label>
  );
};

const styles = StyleSheet.create({
  label: {
    flexShrink: 2,
  },
});
