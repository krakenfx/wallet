import { Networks } from '@/onChain/wallets/registry';

import type { WalletType } from '@/onChain/wallets/registry';

export const buildCaip19FromVaultsData = (assetAddress: string, network: WalletType, networkCaip: string) => {
  if (assetAddress === '0x0000000000000000000000000000000000000000' && network in Networks) {
    return Networks[network].nativeTokenCaipId;
  }

  return networkCaip + '/erc20:' + assetAddress;
};
