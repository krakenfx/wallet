import { useCurrentAccountNumber } from '@/realm/accounts';

import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsConnectedWithExchange = (): boolean => {
  const accountNumber = useCurrentAccountNumber();
  const connectionsArray = Array.from(useSettingsByKey(RealmSettingsKey.krakenConnectAccountsConnected) ?? []);
  return connectionsArray.includes(accountNumber);
};
