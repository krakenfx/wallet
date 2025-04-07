import { useCurrentAccountNumber } from '@/realm/accounts';

import { useKrakenConnectAccountsConnected, useKrakenConnectDismissedCta } from './useKrakenConnectSettings';

export const useIsKrakenConnectCtaHidden = (): boolean => {
  const accountNumber = useCurrentAccountNumber();
  const connectionsArray = useKrakenConnectAccountsConnected();
  const hiddenArray = useKrakenConnectDismissedCta();
  const hiddenOnIndexes = hiddenArray.concat(connectionsArray);
  return hiddenOnIndexes.includes(accountNumber) || connectionsArray.includes(accountNumber);
};
