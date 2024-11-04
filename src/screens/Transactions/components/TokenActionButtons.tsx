import React, { useCallback } from 'react';

import { ActionButtons } from '@/components/ActionButtons';
import { useIsWalletBackupPromptNeeded } from '@/realm/settings';
import { useResolvedAssetBalance } from '@/realm/tokens';
import type { NavigationProps, RouteProps } from '@/Routes';
import { Routes } from '@/Routes';
import type { AssetBalanceId } from '@/types';

interface Props {
  assetBalanceId: AssetBalanceId;
  navigation: NavigationProps<keyof RouteProps>['navigation'];
  canSwap: boolean;
}

export const TokenActionButtons = ({ assetBalanceId, canSwap, navigation }: Props) => {
  const isWalletBackupPromptNeeded = useIsWalletBackupPromptNeeded();

  const [_, __, tokenId] = useResolvedAssetBalance(assetBalanceId);

  const onReceive = useCallback(() => {
    navigation.push(Routes.Receive, { assetBalanceId });
    isWalletBackupPromptNeeded && navigation.push(Routes.WalletBackupPrompt);
  }, [isWalletBackupPromptNeeded, navigation, assetBalanceId]);

  const onSend = useCallback(() => {
    navigation.navigate(Routes.SendStack, { screen: 'Send', params: { assetBalanceId } });
  }, [navigation, assetBalanceId]);

  const onSwap = () => navigation.navigate(Routes.Swap, { tokenId });

  return <ActionButtons onSendPress={onSend} onReceivePress={onReceive} onSwapPress={onSwap} canSwap={canSwap} />;
};
