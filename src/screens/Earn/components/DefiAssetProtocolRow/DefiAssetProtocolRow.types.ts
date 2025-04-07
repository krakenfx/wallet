import type { WalletType } from '@/onChain/wallets/registry';

export interface DefiProtocol {
  apy: number;
  assetId: string;
  name: string;
  protocolLogo: string;
  tvlInUsd: number;
  vaultAddress: string;
  vaultNetwork: WalletType;
}

export interface DefiAssetProtocolRowProps {
  protocol: DefiProtocol;
  isFirst: boolean;
  isLast: boolean;
  closeEarnSheet: () => void;
}
