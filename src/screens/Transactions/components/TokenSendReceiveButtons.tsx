import { useCallback } from 'react';

import { SendReceiveButtons } from '@/components/SendReceiveButtons';
import { useIsWalletBackupPromptNeeded } from '@/realm/settings';
import { NavigationProps, RouteProps, Routes } from '@/Routes';
import { AssetBalanceId } from '@/types';

interface Props {
  assetBalanceId: AssetBalanceId;
  navigation: NavigationProps<keyof RouteProps>['navigation'];
}

export const TokenSendReceiveButtons = ({ assetBalanceId, navigation }: Props) => {
  const isWalletBackupPromptNeeded = useIsWalletBackupPromptNeeded();

  const onReceive = useCallback(() => {
    navigation.push(Routes.Receive, { assetBalanceId });
    isWalletBackupPromptNeeded && navigation.push(Routes.WalletBackupPrompt);
  }, [isWalletBackupPromptNeeded, navigation, assetBalanceId]);

  const onSend = useCallback(() => {
    navigation.navigate(Routes.SendStack, { screen: 'Send', params: { assetBalanceId } });
  }, [navigation, assetBalanceId]);

  return <SendReceiveButtons onSendPress={onSend} onReceivePress={onReceive} />;
};
