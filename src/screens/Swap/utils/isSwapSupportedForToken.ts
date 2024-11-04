import type { Network } from '@/onChain/wallets/base';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmToken } from '@/realm/tokens';

export const isSwapSupportedForNetwork = (network: Network) => {
  return network instanceof EVMNetwork;
};

export const isSwapSupportedForToken = (token?: RealmToken) => {
  if (!token) {
    return false;
  }
  const { network } = getImplForWallet(token.wallet);

  return isSwapSupportedForNetwork(network);
};
