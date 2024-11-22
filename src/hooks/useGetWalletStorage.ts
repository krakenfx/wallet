import { useCallback } from 'react';

import { getWalletStorage } from '@/onChain/wallets/walletState';
import { useRealm } from '@/realm/RealmContext';
import type { RealmWallet } from '@/realm/wallets';

export function useGetWalletStorage() {
  const realm = useRealm();
  return useCallback(
    async (wallet: RealmWallet, shouldRefresh?: boolean) => {
      return await getWalletStorage(realm, wallet, shouldRefresh);
    },
    [realm],
  );
}
