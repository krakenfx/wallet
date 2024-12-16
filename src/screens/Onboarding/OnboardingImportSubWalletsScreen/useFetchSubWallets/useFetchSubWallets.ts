import { useFocusEffect } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import { useCallback, useRef, useState } from 'react';

import { useIsTestnetEnabled } from '@/realm/settings';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { buildSubWallets } from './buildSubWallets';
import { ACCOUNT_BATCH_SIZE, MAX_REQUESTS } from './consts';
import { fetchBtcBalances } from './fetchBtcBalances';
import { fetchHasBalanceForCaip10Accounts } from './fetchHasBalanceForCaip10Accounts';
import { getCaip10Accounts } from './getCaip10Accounts';
import { getWalletName } from './getWalletName';

import type { SubWallet } from '../OnboardingImportSubWalletsScreen.types';

import { handleError } from '/helpers/errorHandler';

export const useFetchSubWallets = (): { isLoadingSubWallets: boolean; subWallets: SubWallet[] } => {
  const { getSeed } = useSecuredKeychain();
  const isTestnetEnabled = useIsTestnetEnabled();
  const [isLoadingSubWallets, setIsLoadingSubWallets] = useState(true);
  const [subWallets, setSubWallets] = useState<SubWallet[]>([]);
  const requestCount = useRef(0);

  const shortCircuit = useCallback(() => {
    if (subWallets.length === 0) {
      setSubWallets([{ index: 0, name: getWalletName(0), hasBalance: true }]);
    }
    setIsLoadingSubWallets(false);
  }, [subWallets.length]);

  useFocusEffect(
    useCallback(
      function getSubWallets(accountIndexStart = 0) {
        (async () => {
          try {
            requestCount.current += 1;

            if (!isLoadingSubWallets || requestCount.current > MAX_REQUESTS) {
              return;
            }

            const caip10Accounts = await getCaip10Accounts(getSeed, accountIndexStart, isTestnetEnabled);

            const [balances, btcBalances] = await Promise.all([fetchHasBalanceForCaip10Accounts(caip10Accounts), fetchBtcBalances(getSeed, accountIndexStart)]);
            const isBalancesEmpty = isEmpty(balances) || isEmpty(btcBalances);

            if (isBalancesEmpty) {
              shortCircuit();
              return;
            }

            const subWallets_ = await buildSubWallets(caip10Accounts, balances, btcBalances);
            const isSubWalletsEmtpy = subWallets_.length === 0;

            if (isSubWalletsEmtpy) {
              shortCircuit();
              return;
            }

            setSubWallets(prevSubWallets => {
              const nextSubWalletsHaveBalance = subWallets_.some(subWallet => subWallet.hasBalance);

              if (nextSubWalletsHaveBalance || prevSubWallets.length === 0) {
                return uniqBy([...prevSubWallets, ...subWallets_], 'index');
              }

              return uniqBy([...prevSubWallets], 'index');
            });

            const compareSubWalletIndexes = (a: SubWallet, b: SubWallet) => a.index - b.index;
            const subWalletsAscending = subWallets_.sort(compareSubWalletIndexes);
            const lastBatchSubWallets = subWalletsAscending.slice(-1 * ACCOUNT_BATCH_SIZE);
            const lastBatchHasBalance = lastBatchSubWallets.some(({ hasBalance }) => hasBalance);

            if (lastBatchHasBalance && requestCount.current < MAX_REQUESTS) {
              const lastBatchLastAccountIndex = lastBatchSubWallets[lastBatchSubWallets.length - 1].index;

              getSubWallets(lastBatchLastAccountIndex + 1);
            } else {
              setIsLoadingSubWallets(false);
            }
          } catch (e) {
            handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
            shortCircuit();
          }
        })();
      },
      [getSeed, isLoadingSubWallets, isTestnetEnabled, shortCircuit],
    ),
  );

  return {
    isLoadingSubWallets,
    subWallets,
  };
};
