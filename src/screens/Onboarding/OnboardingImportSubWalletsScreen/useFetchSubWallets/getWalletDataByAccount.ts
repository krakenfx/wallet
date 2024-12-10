import type { Network, WalletData } from '@/onChain/wallets/base';

export function getWalletDataByAccount(seed: ArrayBuffer, network: Network, accountIndex: number): WalletData {
  const extendedPublicKeyAndChainCode = network.getExtendedPublicKey(seed, accountIndex);
  const walletData: WalletData = {
    extendedPublicKey: extendedPublicKeyAndChainCode.extendedPublicKey,
    chainCode: extendedPublicKeyAndChainCode.chainCode ?? null,
    accountIdx: accountIndex,
  };

  return walletData;
}
