import { useCurrentAccountNumber } from '@/realm/accounts';

import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsKrakenConnectCtaHidden = (): boolean => {
  const accountNumber = useCurrentAccountNumber();
  const connectionsArray = Array.from(useSettingsByKey(RealmSettingsKey.krakenConnectAccountsConnected) ?? []);
  const hiddenArray = Array.from(useSettingsByKey(RealmSettingsKey.krakenConnectDismissedCta) ?? []);
  const hiddenOnIndexes = hiddenArray.concat(connectionsArray);
  return hiddenOnIndexes.includes(accountNumber);
};
