import type { CardData } from '@/components/DefiDiscoveryPreview/DefiDiscoveryPreview.types';
import type { WalletType } from '@/onChain/wallets/registry';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

export function adaptTopVaultToCardData(topVault: TopVault): CardData {
  return {
    assetId: topVault.asset?.assetAddress ?? ChainAgnostic.COIN_ETHEREUM,
    assetSymbol: topVault.asset?.symbol ?? 'ETH',
    assetNetwork: topVault.networkName === 'mainnet' ? 'ethereum' : topVault.networkName,
    protocolIcon: undefined,
    protocolName: topVault.protocol.name + ' ' + topVault.protocol.version,
    protocolApr: `${topVault.apy / 100}% `,
  };
}

export type TopVault = {
  name: string;
  protocol: {
    name: string;
    product: string;
    version: string;
  };
  vaultAddress: string;
  networkName: WalletType | 'mainnet';
  tvlInUsd: number;
  apy: number;
  projectedEarnings: number;
  asset?: {
    assetAddress: string;
    decimals: number;
    name: string;
    symbol: string;
  };
};
