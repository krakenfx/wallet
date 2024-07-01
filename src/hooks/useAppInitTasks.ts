import { useWhatsNewQueue } from '@/hooks/whatsNewHooks/useWhatsNewQueue';

import { useAppInitEffect } from './useAppInitEffect';
import { useStoreReviewTask } from './useStoreReviewTask';
import { useWalletConnectExplainerTask } from './useWalletConnectExplainerTask';

export const useAppInitTasks = () => {
  const walletConnectExplainerTask = useWalletConnectExplainerTask();
  const storeReviewTask = useStoreReviewTask();
  useWhatsNewQueue();

  useAppInitEffect(count => {
    switch (count) {
      case 2:
        walletConnectExplainerTask.runIfNeeded();
        break;
      case 20:
        storeReviewTask.runIfNeeded();
        break;
    }
  });
};
