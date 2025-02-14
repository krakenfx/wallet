import { StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { KrakenIcon } from '@/components/KrakenIcon';
import { TransactionPath } from '@/components/Transaction';
import { useAccountById, useCurrentAccountNumber } from '@/realm/accounts';

export const TransactionPathFromKrakenToWallet = () => {
  const accountNumber = useCurrentAccountNumber();
  const account = useAccountById(accountNumber);
  return (
    <View style={styles.path}>
      <TransactionPath
        to={account.accountCustomName}
        toIcon={
          <View style={styles.icon}>
            <AvatarIcon accountNumber={account.accountNumber} accountAvatar={account.avatar} />
          </View>
        }
        from="Kraken"
        fromIcon={
          <View style={styles.icon}>
            <KrakenIcon size={32} iconSize={20} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 20,
    marginRight: 12,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  path: {
    height: 80,
  },
});
