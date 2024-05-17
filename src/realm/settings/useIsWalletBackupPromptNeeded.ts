import { RealmSettingsKey } from './schema';
import { useIsWalletBackupDone } from './useIsWalletBackupDone';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsWalletBackupPromptNeeded = () => {
  const isWalletBackupNeeded = !useIsWalletBackupDone();
  const hasViewedWalletBackupPrompt = !!useSettingsByKey(RealmSettingsKey.hasViewedWalletBackupPrompt);

  return isWalletBackupNeeded && !hasViewedWalletBackupPrompt;
};
