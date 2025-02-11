import type { WalletType } from '@/onChain/wallets/registry';

export type CardData = {
  assetAddress: string;
  assetCaipId: string;
  assetName: string;
  assetNetwork: WalletType;
  assetSymbol: string;
  protocolDescription?: string;
  protocolLogo: string;
  protocolName: string;
  protocolApy: string;
  vaultAddress: string;
  vaultNetwork: WalletType;
};
