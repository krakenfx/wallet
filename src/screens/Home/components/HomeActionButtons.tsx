import { StyleSheet } from 'react-native';

import { ActionButtons } from '@/components/ActionButtons';
import { useIsWalletBackupPromptNeeded } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';

interface Props {
  navigation: NavigationProps<'Home'>['navigation'];
}

export const HomeActionButtons = ({ navigation }: Props) => {
  const isWalletBackupPromptNeeded = useIsWalletBackupPromptNeeded();
  const onReceivePress = () => {
    navigation.push(Routes.UniversalReceive);
    isWalletBackupPromptNeeded && navigation.push(Routes.WalletBackupPrompt);
  };
  const onSendPress = () => navigation.navigate(Routes.UniversalSend);

  const onSwapPress = () => navigation.navigate(Routes.Swap);

  return <ActionButtons canSwap style={styles.container} onReceivePress={onReceivePress} onSendPress={onSendPress} onSwapPress={onSwapPress} />;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },
});
