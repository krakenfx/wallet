import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { CardWarning } from '@/components/CardWarning';
import { useIsWalletBackupDone } from '@/realm/settings/useIsWalletBackupDone';
import { Routes } from '@/Routes';

import loc from '/loc';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const WalletBackupWarning = ({ style }: Props) => {
  const isWalletBackupDone = useIsWalletBackupDone();

  const { navigate } = useNavigation();

  if (isWalletBackupDone) {
    return null;
  }

  const handlePress = () => {
    navigate(Routes.Settings, { screen: Routes.SettingsWalletBackup, initial: false });
  };

  return (
    <View style={[styles.container, style]}>
      <CardWarning
        title={loc.walletBackup.backupYourWallet}
        description={loc.walletBackup.backupYourWalletDescription}
        type="negative"
        buttonText={loc.walletBackup.backup}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
