import { OpenURL } from '@/hooks/useBrowser';
import { WalletType, getImplForType } from '@/onChain/wallets/registry';

export const openExplorer = (walletType: WalletType, txid: string, openURL: OpenURL) => {
  const { network } = getImplForType(walletType);
  const url = network.blockExplorer?.transactionUri(txid);

  if (url) {
    openURL(url);
  }
};
