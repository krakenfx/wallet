import { showToast } from '@/components/Toast';
import { Routes } from '@/Routes';

import loc from '/loc';

export const refreshingTransactionsEvent = 'refreshingTransactions';

export const showRefreshingTransactionsToast = async () =>
  showToast({
    type: 'info',
    text: loc._.updating,
    id: refreshingTransactionsEvent,
    testID: 'RefreshingTransactionsToast',
    dismissMode: 'event',
    iconLottieSource: require('@/assets/lottie/refreshSpinner.json'),
    whiteListRoutes: [Routes.Transactions],
  });
