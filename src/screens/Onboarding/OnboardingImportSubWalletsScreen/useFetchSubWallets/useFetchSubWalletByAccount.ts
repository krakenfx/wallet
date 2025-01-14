import { useCallback, useEffect, useRef, useState } from 'react';

import { useIsTestnetEnabled } from '@/realm/settings';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { buildSubWallets } from './buildSubWallets';
import { fetchHasBalanceBtcForAccount } from './fetchHasBalanceBtcForAccount';
import { fetchHasBalanceForCaip10Accounts } from './fetchHasBalanceForCaip10Accounts';
import { fetchSubWalletByAccountCache } from './fetchSubWalletByAccountCache';
import { getCaip10Accounts } from './getCaip10Accounts';

import type { SubWallet } from '../OnboardingImportSubWalletsScreen.types';

import { handleError } from '/helpers/errorHandler';

export const useFetchSubWalletByAccount = (accountNumber: string) => {
  const { getSeed } = useSecuredKeychain();
  const isTestnetEnabled = useIsTestnetEnabled();
  const accountNumber_ = accountNumber === '' ? accountNumber : parseInt(accountNumber, 10);

  const [subWallet, setSubWallet] = useState<SubWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestId = useRef(0);

  const fetchSubWallet = useCallback(async () => {
    const thisRequestId = Date.now();
    requestId.current = thisRequestId;
    const isLatestRequest = () => thisRequestId >= requestId.current;

    if (accountNumber_ === '' || isNaN(accountNumber_)) {
      setSubWallet(null);
      setIsLoading(false);
      return;
    }

    if (fetchSubWalletByAccountCache[accountNumber]) {
      setSubWallet(fetchSubWalletByAccountCache[accountNumber]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const caip10Accounts = await getCaip10Accounts({ getSeed, accountIndexStart: accountNumber_, isTestnetEnabled, accountBatchSize: 1 });
      const [balance, btcBalance] = await Promise.all([
        fetchHasBalanceForCaip10Accounts(caip10Accounts),
        fetchHasBalanceBtcForAccount(getSeed, accountNumber_),
      ]);
      const subWallets = await buildSubWallets(caip10Accounts, balance, btcBalance);
      const subWallet = subWallets[0] ?? null;

      if (isLatestRequest()) {
        setSubWallet(subWallet);
      }

      if (subWallet) {
        fetchSubWalletByAccountCache[accountNumber] = subWallet;
      }
    } catch (error) {
      if (isLatestRequest()) {
        setSubWallet(null);
      }
      delete fetchSubWalletByAccountCache[accountNumber];
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    }

    setIsLoading(false);
  }, [accountNumber, accountNumber_, getSeed, isTestnetEnabled]);

  useEffect(() => {
    fetchSubWallet();
  }, [fetchSubWallet]);

  return { subWallet, isLoading };
};
