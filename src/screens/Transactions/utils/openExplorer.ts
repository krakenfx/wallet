import type { OpenURL } from '@/hooks/useBrowser';
import type { WalletType } from '@/onChain/wallets/registry';
import { getImplForType } from '@/onChain/wallets/registry';

export const openExplorer = (walletType: WalletType, txid: string, openURL: OpenURL) => {
  const { network } = getImplForType(walletType);
  const url = network.blockExplorer?.transactionUri(txid);

  if (url) {
    openURL(url);
  }
};
