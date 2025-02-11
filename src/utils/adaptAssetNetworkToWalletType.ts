import type { WalletType } from '@/onChain/wallets/registry';
import { Networks } from '@/onChain/wallets/registry';

export function adaptAssetNetworkToWalletType(assetNetwork: string): WalletType {
  const walletTypes = Object.keys(Networks);

  if (walletTypes.includes(assetNetwork)) {
    return assetNetwork as WalletType;
  }

  return 'ethereum';
}
