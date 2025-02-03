import { getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmToken } from '@/realm/tokens';

import { SWAP_NETWORKS_CAIP_IDS } from '../SwapScreen.constants';

export const isSwapSupportedForToken = (token?: RealmToken) => {
  if (!token) {
    return false;
  }
  const { network } = getImplForWallet(token.wallet);

  return SWAP_NETWORKS_CAIP_IDS.includes(network.caipId);
};
