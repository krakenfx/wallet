import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';

import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsWalletBackupPromptNeeded = () => {
  const { isAnyBackupCompleted } = useWalletBackupSettings();
  const hasViewedWalletBackupPrompt = !!useSettingsByKey(RealmSettingsKey.hasViewedWalletBackupPrompt);

  return !isAnyBackupCompleted && !hasViewedWalletBackupPrompt;
};
