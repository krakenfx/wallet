import { useCurrentAccountNumber } from '@/realm/accounts';

import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsConnectedWithExchange = (selectedAccount?: number): boolean => {
  const accountNumber = useCurrentAccountNumber();
  const connectionsArray = Array.from(useSettingsByKey(RealmSettingsKey.krakenConnectAccountsConnected) ?? []);
  const accountId = selectedAccount ?? accountNumber;
  return connectionsArray.includes(accountId);
};
