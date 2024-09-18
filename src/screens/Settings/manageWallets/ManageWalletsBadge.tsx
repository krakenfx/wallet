import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { useAccounts } from '@/realm/accounts';

import { SettingsTextBadge } from '../components';

export const ManageWalletsBadge = () => {
  const accounts = useAccounts();
  const { isAnyBackupCompleted, isAnyBackupNeeded } = useWalletBackupSettings();

  const icon = useMemo(() => {
    if (!isAnyBackupCompleted) {
      return <SvgIcon color="red400" name="error" />;
    }
    return <SvgIcon color={isAnyBackupNeeded ? 'light50' : 'green400'} name="check-circle-filled" />;
  }, [isAnyBackupCompleted, isAnyBackupNeeded]);

  return (
    <View style={styles.container}>
      {icon}
      {accounts.length > 1 && <SettingsTextBadge text={String(accounts.length)} isCircle containerStyle={styles.accountBadge} />}
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
