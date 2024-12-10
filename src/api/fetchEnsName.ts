import { ethereumNetwork } from '@/onChain/wallets/evmNetworks';
import { getImplForWallet } from '@/onChain/wallets/registry';

import type { RealmWallet } from '@/realm/wallets';

import NameResolver from './NameResolver';

export const fetchEnsName = async (wallet: RealmWallet) => {
  const { network } = getImplForWallet(wallet);

  const address = await network.deriveAddress(wallet);

  return resolveAddressToEnsName(address);
};

export const resolveAddressToEnsName = async (address: string) => {
  try {
    const resolver = new NameResolver(ethereumNetwork);
    const resolvedAddressName = await resolver.resolveAddress(address);
    return resolvedAddressName;
  } catch (error) {
    console.log('No ENS found');
    return;
  }
};
