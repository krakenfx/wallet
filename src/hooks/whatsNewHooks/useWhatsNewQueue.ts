import { useEffect, useMemo, useRef } from 'react';

import { RealmSettingsKey } from '@/realm/settings';
import { Routes } from '@/Routes';

import { useWhatsNewTask } from './useWhatsNewTask';

export const useWhatsNewQueue = () => {
  const isInitialised = useRef(false);

  const avaxLineaTask = useWhatsNewTask(RealmSettingsKey.isAvaxLineaTaskModalCompleted, Routes.WhatsNewAvaxLinea);
  const browserExploreTask = useWhatsNewTask(RealmSettingsKey.isBrowserExploreTaskModalCompleted, Routes.WhatsNewBrowserExplore);
  const swapsTask = useWhatsNewTask(RealmSettingsKey.isSwapsTaskModalCompleted, Routes.WhatsNewSwaps);

  const queue = useMemo(() => [browserExploreTask, avaxLineaTask, swapsTask], [browserExploreTask, avaxLineaTask, swapsTask]);

  useEffect(() => {
    if (isInitialised.current) {
      return;
    }
    isInitialised.current = true;

    for (const welcomeTask of queue) {
      if (!welcomeTask.isTaskCompleted) {
        welcomeTask.task();
        break;
      }
    }
  }, [queue]);
};
