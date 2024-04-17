import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsWalletBackupDone = () => {
  return !!useSettingsByKey(RealmSettingsKey.isWalletBackupDone);
};
