import { WalletType, getImplForType } from '@/onChain/wallets/registry';

export const getWalletName = (walletType: WalletType) => {
  const { network } = getImplForType(walletType);
  return network.label;
};
