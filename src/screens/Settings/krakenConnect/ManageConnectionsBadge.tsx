import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';

import { useKrakenConnectAccountsConnected } from '@/realm/krakenConnect/useKrakenConnectSettings';

import { SettingsTextBadge } from '../components';

export const ManageConnectionsBadge = () => {
  const accounts = useKrakenConnectAccountsConnected();
  const hasConnection = accounts.length > 0;

  return (
    <View style={styles.container}>
      <SvgIcon color={!hasConnection ? 'light50' : 'green400'} name="check-circle-filled" />
      {hasConnection && <SettingsTextBadge text={String(accounts.length)} isCircle containerStyle={styles.accountBadge} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBadge: {
    marginLeft: 10,
  },
});
