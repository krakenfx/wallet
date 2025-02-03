import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { InteractionManager } from 'react-native';

import { useIsTaskCompleted } from '@/hooks/whatsNewHooks/useIsTaskCompleted';
import { type SettingsType } from '@/realm/settings';

import type { NavigationProps, Routes } from '@/Routes';

type WhatsNewRoutes = Extract<keyof typeof Routes, `WhatsNew${string}`>;

export const useWhatsNewTask = (taskKey: keyof SettingsType, route: WhatsNewRoutes) => {
  const navigation = useNavigation<NavigationProps<'Home'>['navigation']>();
  const isTaskCompleted = useIsTaskCompleted(taskKey);

  const task = useCallback(() => {
    if (!isTaskCompleted) {
      InteractionManager.runAfterInteractions(() => {
        navigation.navigate(route);
      });
    }
  }, [isTaskCompleted, navigation, route]);

  return {
    task,
    isTaskCompleted,
  };
};
