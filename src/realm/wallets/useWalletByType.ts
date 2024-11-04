import type { WalletType } from '@/onChain/wallets/registry';

import { useRealmWallets } from './useWallets';

export const useWalletByType = (type: WalletType) => {
  const accountWallets = useRealmWallets();
  return accountWallets.filtered(`type == $0`, type)[0];
};
