import { useMemo } from 'react';

import { useCurrentAccountNumber } from '../accounts';

import { useKrakenConnectAccountsConnected } from './useKrakenConnectSettings';

export const useIsAccountConnected = (accountNumber?: number) => {
  const currentAccountNumber = useCurrentAccountNumber();
  const connectedAccounts = useKrakenConnectAccountsConnected();

  const accountNumberToCheck = accountNumber ?? currentAccountNumber;

  return useMemo(() => connectedAccounts.includes(accountNumberToCheck), [connectedAccounts, accountNumberToCheck]);
};
