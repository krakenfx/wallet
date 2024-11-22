import { useEffect, useState } from 'react';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

export const useFetchSubWallets = (): { isLoadingSubWallets: boolean; subWallets: SubWallet[] } => {
  const [isLoadingSubWallets, setIsFindingSubWallets] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsFindingSubWallets(false);
    }, 3000);
  });

  return {
    isLoadingSubWallets,
    subWallets: [
      { id: 0, name: 'test sub wallet' },
      { id: 1, name: 'test sub wallet' },
    ],
  };
};
