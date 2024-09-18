import { SettingsType, useSettingsByKey } from '@/realm/settings';

export const useIsTaskCompleted = (taskKey: keyof SettingsType) => {
  const taskCompleted = useSettingsByKey(taskKey);
  
  
  
  return !(taskCompleted === false);
};
