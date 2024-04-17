import { Linking } from 'react-native';

import { WalletType, getImplForType } from '@/onChain/wallets/registry';

export const openExplorer = (walletType: WalletType, txid: string) => {
  const { network } = getImplForType(walletType);
  const url = network.blockExplorer?.transactionUri(txid);
  if (url) {
    Linking.openURL(url);
  }
};
