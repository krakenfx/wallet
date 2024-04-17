import React from 'react';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { LargeHeader } from '@/components/LargeHeader';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { useAccountsMutations } from '@/realm/accounts';
import { useCurrentAccount } from '@/realm/accounts/useCurrentAccount';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTotalWalletBalance } from '@/realm/tokenPrice';

import { WaitForAccountSwitchSettled } from './WaitForAccountSwitchSettled';

import loc from '/loc';
import { prettifyFiatValue } from '/modules/text-utils';

const UPDATE_BALANCE_DEBOUNCE = 2000;

export const HomeBalance = () => {
  const { currency } = useAppCurrency();
  const currentAccount = useCurrentAccount();

  return (
    <>
      <WaitForAccountSwitchSettled>
        <BalanceUpdater />
      </WaitForAccountSwitchSettled>
      <LargeHeader testID="TotalBalanceHeader" title={loc.home.total_balance}>
        <AnimatedNumbers type="headerBalance" value={prettifyFiatValue(currentAccount.balance)} ticker={currency} fontSize={56} glyphSize={41} />
      </LargeHeader>
    </>
  );
};

const BalanceUpdater = () => {
  const totalTokensAppCurrencyValue = useTotalWalletBalance();
  const { setCurrentAccountBalance } = useAccountsMutations();

  useDebounceEffect(
    () => {
      setCurrentAccountBalance(totalTokensAppCurrencyValue);
    },
    [totalTokensAppCurrencyValue],
    UPDATE_BALANCE_DEBOUNCE,
    { leading: true },
  );

  return null;
};
