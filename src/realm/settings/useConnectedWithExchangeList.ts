import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useConnectedWithExchangeList = (): number[] => {
  const accounts = useSettingsByKey(RealmSettingsKey.krakenConnectAccountsConnected) ?? [];
  return Array.from(accounts);
};
