import { useWhatsNewQueue } from '@/hooks/whatsNewHooks/useWhatsNewQueue';

import { useAppInitEffect } from './useAppInitEffect';
import { useStoreReviewTask } from './useStoreReviewTask';

export const useAppInitTasks = () => {
  const storeReviewTask = useStoreReviewTask();
  useWhatsNewQueue();

  useAppInitEffect(count => {
    switch (count) {
      case 20:
        storeReviewTask.runIfNeeded();
        break;
    }
  });
};
