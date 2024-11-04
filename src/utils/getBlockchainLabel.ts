import { getImplForType } from '@/onChain/wallets/registry';
import { type WalletType } from '@/onChain/wallets/registry';

export const getBlockchainLabel = (walletType: WalletType) => {
  const { network } = getImplForType(walletType);

  return network.blockchainLabel ? `${network.label} ${network.blockchainLabel}` : network.label;
};
