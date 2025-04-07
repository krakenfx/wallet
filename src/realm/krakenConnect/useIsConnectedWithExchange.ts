import { useCurrentAccountNumber } from '@/realm/accounts';

import { useKrakenConnectAccountsConnected } from './useKrakenConnectSettings';

export const useIsConnectedWithExchange = (selectedAccount?: number): boolean => {
  const accountNumber = useCurrentAccountNumber();
  const connectedAccountsIds = useKrakenConnectAccountsConnected();
  const accountId = selectedAccount ?? accountNumber;
  return connectedAccountsIds.includes(accountId);
};
