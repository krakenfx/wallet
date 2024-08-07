import { useEffect, useMemo, useRef } from 'react';

import { RealmSettingsKey } from '@/realm/settings';
import { Routes } from '@/Routes';

import { useWhatsNewTask } from './useWhatsNewTask';

export const useWhatsNewQueue = () => {
  const blastTask = useWhatsNewTask(RealmSettingsKey.isBlastModalCompleted, Routes.WhatsNewBlast);
  const assetMarketDataTask = useWhatsNewTask(RealmSettingsKey.whatsNewIsAssetMarketDataCompleted, Routes.WhatsNewAssetMarketData);
  const longPressTask = useWhatsNewTask(RealmSettingsKey.whatsNewIsLongPressCompleted, Routes.WhatsNewLongPress);
  const isInitialised = useRef(false);
  const queue = useMemo(() => [blastTask, assetMarketDataTask, longPressTask], [assetMarketDataTask, blastTask, longPressTask]);

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
