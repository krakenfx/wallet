import { useMemo } from 'react';

import { useCurrentAccountNumber } from '../accounts';
import { useConnectedWithExchangeList } from '../settings/useConnectedWithExchangeList';

export const useIsAccountConnected = (accountNumber?: number) => {
  const currentAccountNumber = useCurrentAccountNumber();
  const connectedAccounts = useConnectedWithExchangeList();

  const accountNumberToCheck = accountNumber ?? currentAccountNumber;

  return useMemo(() => connectedAccounts.includes(accountNumberToCheck), [connectedAccounts, accountNumberToCheck]);
};
