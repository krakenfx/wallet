import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

export const useDeviceFontScale = () => {
  const deviceFontScale = useSettingsByKey(RealmSettingsKey.deviceFontScale);
  return deviceFontScale ?? 1;
};
