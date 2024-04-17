import { useCallback } from 'react';

import { ALL_MAINNET_COINS, DEFAULT_GALLERY_COINS } from '@/onChain/wallets/registry';
import { useAccountsMutations } from '@/realm/accounts';
import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { useWalletsMutations } from '@/realm/wallets';
import { generateMnemonic } from '@/screens/Onboarding/utils/generateMnemonic';
import { setSeedInKeychain } from '@/secureStore';

export const useCreateWallet = () => {
  const { addNewWallet } = useWalletsMutations();
  const { addNewAccount } = useAccountsMutations();

  const { runInTransaction } = useRealmTransaction();

  const createWallet = useCallback(async () => {
    const secret = generateMnemonic();
    const seed = await setSeedInKeychain(secret);
    return runInTransaction(() => {
      for (const type of ALL_MAINNET_COINS) {
        addNewWallet({ seed, accountIdx: 0, type, addToGallery: DEFAULT_GALLERY_COINS.includes(type) });
      }
      addNewAccount({ accountNumber: 0 });
    });
  }, [addNewAccount, addNewWallet, runInTransaction]);

  return { createWallet };
};
