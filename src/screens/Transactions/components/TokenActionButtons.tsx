import { useCallback } from 'react';

import { ActionButtons } from '@/components/ActionButtons';
import { useGetKrakenSupportedAsset } from '@/reactQuery/hooks/krakenConnect/useGetKrakenSupportedAsset';
import { useIsAccountConnected } from '@/realm/krakenConnect/useIsAccountConnected';
import { useIsWalletBackupPromptNeeded } from '@/realm/settings';
import { useResolvedAssetBalance } from '@/realm/tokens';
import type { NavigationProps, RouteProps } from '@/Routes';
import { Routes } from '@/Routes';
import type { AssetBalanceId } from '@/types';

interface Props {
  assetBalanceId: AssetBalanceId;
  navigation: NavigationProps<keyof RouteProps>['navigation'];
  canSwap: boolean;
  assetSymbol?: string;
  krakenConnectNetworkId?: string | null;
}

export const TokenActionButtons = ({ assetBalanceId, canSwap, navigation, assetSymbol, krakenConnectNetworkId }: Props) => {
  const isWalletBackupPromptNeeded = useIsWalletBackupPromptNeeded();
  const { krakenAsset } = useGetKrakenSupportedAsset(assetSymbol);
  const isAccountConnectedWithExchange = useIsAccountConnected();

  const [_, __, tokenId] = useResolvedAssetBalance(assetBalanceId);

  const onReceive = useCallback(() => {
    navigation.push(Routes.Receive, { assetBalanceId });
    isWalletBackupPromptNeeded && navigation.push(Routes.WalletBackupPrompt);
  }, [isWalletBackupPromptNeeded, navigation, assetBalanceId]);

  const onSend = useCallback(() => {
    navigation.navigate(Routes.SendStack, { screen: 'Send', params: { assetBalanceId } });
  }, [navigation, assetBalanceId]);

  const onTransfer = useCallback(() => {
    if (!krakenAsset || !krakenConnectNetworkId) {
      return;
    }
    navigation.navigate(Routes.KrakenConnectSendStack, {
      screen: 'KrakenConnectSend',
      params: {
        krakenAsset,
        networkId: krakenConnectNetworkId,
      },
    });
  }, [krakenAsset, krakenConnectNetworkId, navigation]);

  const onSwap = () => navigation.navigate(Routes.Swap, { tokenId });

  return (
    <ActionButtons
      onSendPress={onSend}
      onReceivePress={onReceive}
      onSwapPress={onSwap}
      canSwap={canSwap}
      onTransferPress={onTransfer}
      krakenAsset={isAccountConnectedWithExchange && krakenConnectNetworkId ? krakenAsset : undefined}
    />
  );
};
