import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useIsTestnetEnabled = () => {
  return !!useSettingsByKey(RealmSettingsKey.isTestnetEnabled);
};
