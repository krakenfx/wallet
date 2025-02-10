import type { WalletType } from '@/onChain/wallets/registry';
import { Networks } from '@/onChain/wallets/registry';

export function adaptVaultsNetworkToWalletType(network: string): WalletType {
  const walletTypes = Object.keys(Networks);

  if (walletTypes.includes(network)) {
    return network as WalletType;
  }

  return 'ethereum';
}
