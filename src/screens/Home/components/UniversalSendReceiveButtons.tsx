import React from 'react';

import { StyleSheet } from 'react-native';

import { SendReceiveButtons } from '@/components/SendReceiveButtons';
import { useIsWalletBackupPromptNeeded } from '@/realm/settings';
import { NavigationProps, Routes } from '@/Routes';

interface Props {
  navigation: NavigationProps<'Home'>['navigation'];
}

export const UniversalSendReceiveButtons = ({ navigation }: Props) => {
  const isWalletBackupPromptNeeded = useIsWalletBackupPromptNeeded();
  const onReceivePress = () => {
    navigation.push(Routes.UniversalReceive);
    isWalletBackupPromptNeeded && navigation.push(Routes.WalletBackupPrompt);
  };
  const onSendPress = () => navigation.navigate(Routes.UniversalSend);

  return <SendReceiveButtons style={styles.container} onReceivePress={onReceivePress} onSendPress={onSendPress} />;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },
});
