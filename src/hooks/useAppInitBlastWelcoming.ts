import { useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';

import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';

import { NavigationProps, Routes } from '@/Routes';

const useBlastWelcomingTask = () => {
  const { setIsBlastModalCompleted } = useSettingsMutations();
  const taskCompleted = useSettingsByKey(RealmSettingsKey.isBlastModalCompleted);
  const navigation = useNavigation<NavigationProps<'Home'>['navigation']>();

  if (taskCompleted === false) {
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(Routes.BlastWelcoming);
      setIsBlastModalCompleted(true);
    });
  }
};

export const useAppInitBlastWelcoming = () => {
  return useBlastWelcomingTask();
};
