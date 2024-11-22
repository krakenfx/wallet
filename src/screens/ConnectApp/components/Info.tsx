import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { NetworkIDIcons } from '@/components/NetworkIDIcons';
import { DEFAULT_ACCOUNT_NAME, useAccountById, useCurrentAccountNumber } from '@/realm/accounts';

import loc from '/loc';

type Props = {
  networkIDs: string[];
};

export const Info = ({ networkIDs }: Props) => {
  const accountNumber = useCurrentAccountNumber();
  const account = useAccountById(accountNumber);

  return (
    <View style={styles.container}>
      <Label type="boldCaption1">{(account?.isValid() && account.accountCustomName) || DEFAULT_ACCOUNT_NAME}</Label>
      <View style={styles.networks}>
        {}
        <NetworkIDIcons align="right" containerStyle={styles.icons} networkIDs={networkIDs} />
        <Label type="boldCaption1">{loc.connectApp.all_networks}</Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networks: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icons: {
    marginRight: 4,
    justifyContent: 'flex-end',
  },
});
