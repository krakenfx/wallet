import type { WalletType } from '@/onChain/wallets/registry';

import { useRealmWallets } from './useWallets';

export const useWalletByType = (type: WalletType, accountNumber?: number) => {
  const accountWallets = useRealmWallets(false, accountNumber);
  return accountWallets.filtered(`type == $0`, type)[0];
};
