import { getImplForWallet } from '@/onChain/wallets/registry';
import { RealmWallet } from '@/realm/wallets';

import { isSupportedNetwork } from '/modules/wallet-connect/utils';

export function getMatchedWallets(wallets: RealmResults<RealmWallet>, requestedNetworkIDs: string[]): RealmWallet[] {
  const matchedWallets: RealmWallet[] = [];

  wallets.forEach(wallet => {
    if (!wallet) {
      return;
    }

    const network = getImplForWallet(wallet).network;

    if (!isSupportedNetwork(network)) {
      return;
    }

    if (requestedNetworkIDs.includes(network.caipId)) {
      matchedWallets.push(wallet);
    }
  });

  return matchedWallets;
}
