import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmToken } from '@/realm/tokens';
import type { RealmWallet } from '@/realm/wallets';

import { getWalletName } from './getWalletName';

export function getLabelName(token: RealmToken | undefined, wallet: RealmWallet) {
  if (token === undefined) {
    return getWalletName(wallet.type);
  }

  const isChainAgnostic = Object.values(ChainAgnostic).includes(token?.assetId);
  const defaultLabel = wallet.nativeTokenLabel ?? token?.metadata.label;
  const fallbackLabel = token?.metadata.label ?? wallet.nativeTokenLabel;

  return isChainAgnostic ? defaultLabel : fallbackLabel;
}
