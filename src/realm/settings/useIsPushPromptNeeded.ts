import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsPushPromptNeeded = () => {
  return useSettingsByKey(RealmSettingsKey.isPushPromptNeeded);
};
