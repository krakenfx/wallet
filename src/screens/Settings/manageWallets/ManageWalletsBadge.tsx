import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useAccounts } from '@/realm/accounts';
import { useIsWalletBackupDone } from '@/realm/settings/useIsWalletBackupDone';

import { SettingsTextBadge } from '../components';

export const ManageWalletsBadge = () => {
  const accounts = useAccounts();
  const isWalletBackupDone = useIsWalletBackupDone();

  return (
    <View style={styles.container}>
      {!isWalletBackupDone && <SvgIcon color="red400" name="error" style={styles.icon} />}
      <SettingsTextBadge text={String(accounts.length)} isCircle />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
