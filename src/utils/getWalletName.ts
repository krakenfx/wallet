import type { WalletType } from '@/onChain/wallets/registry';
import { getImplForType } from '@/onChain/wallets/registry';

export const getWalletName = (walletType: WalletType) => {
  const { network } = getImplForType(walletType);
  return network.label;
};
