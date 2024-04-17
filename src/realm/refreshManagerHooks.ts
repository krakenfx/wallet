import EventEmitter from 'eventemitter3';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';

import { hideToast, showToast } from '@/components/Toast';
import { Routes } from '@/Routes';

import { REALM_TYPE_ACCOUNT, RealmAccount, useAccountsMutations, useCurrentAccountNumber } from './accounts';
import { useDefiFetch } from './defi';
import { useNftsFetch } from './nfts';
import { useRealm } from './RealmContext';
import { useTokenPriceFetch } from './tokenPrice';
import { useTokensFetch } from './tokens';
import { useTransactionsFetch } from './transactions';

import loc from '/loc';

const refreshEmitter = new EventEmitter();
enum RefreshEmitter {
  refreshAllTokens = 'refreshAllTokens',
  refreshAllNfts = 'refreshAllNfts',
  refreshTokenPrices = 'refreshTokenPrices',
  refreshAllTransactions = 'refreshAllTransactions',
}

const DEBOUNCE_FETCH_TIME = 1000;

export const refreshAllTokens = debounce(() => {
  refreshEmitter.emit(RefreshEmitter.refreshAllTokens);
}, DEBOUNCE_FETCH_TIME);

export const refreshAllNfts = debounce(() => {
  refreshEmitter.emit(RefreshEmitter.refreshAllNfts);
}, DEBOUNCE_FETCH_TIME);

export const refreshTokenPrices = debounce(() => {
  refreshEmitter.emit(RefreshEmitter.refreshTokenPrices);
}, DEBOUNCE_FETCH_TIME);

export const refreshAllTransactions = debounce(() => {
  refreshEmitter.emit(RefreshEmitter.refreshAllTransactions);

  setTimeout(() => refreshEmitter.emit(RefreshEmitter.refreshAllTransactions), 10000);
}, DEBOUNCE_FETCH_TIME);

export const useRegisterRefreshManager = () => {
  const { fetchAllTokenPrices } = useTokenPriceFetch();
  const { fetchAndUpdateNfts } = useNftsFetch();
  const { fetchAndUpdateTokens } = useTokensFetch();
  const { fetchAllTransactionsForAllNetworks } = useTransactionsFetch();

  useEffect(() => {
    refreshEmitter.on(RefreshEmitter.refreshAllTokens, fetchAndUpdateTokens);
    refreshEmitter.on(RefreshEmitter.refreshAllNfts, fetchAndUpdateNfts);
    refreshEmitter.on(RefreshEmitter.refreshTokenPrices, fetchAllTokenPrices);
    refreshEmitter.on(RefreshEmitter.refreshAllTransactions, fetchAllTransactionsForAllNetworks);

    return () => {
      refreshEmitter.off(RefreshEmitter.refreshAllTokens, fetchAndUpdateTokens);
      refreshEmitter.off(RefreshEmitter.refreshAllNfts, fetchAndUpdateNfts);
      refreshEmitter.off(RefreshEmitter.refreshTokenPrices, fetchAllTokenPrices);
      refreshEmitter.off(RefreshEmitter.refreshAllTransactions, fetchAllTransactionsForAllNetworks);
    };
  }, [fetchAllTokenPrices, fetchAndUpdateNfts, fetchAndUpdateTokens, fetchAllTransactionsForAllNetworks]);
};

export const refreshingAllEvent = 'refreshingAll';

const REFRESH_TOAST_TIMEOUT = 3000;
export const showRefreshLoading = async () =>
  showToast({
    type: 'info',
    text: loc._.updating,
    id: refreshingAllEvent,
    testID: 'UpdatingToast',
    dismissMode: 'event',
    iconLottieSource: require('@/assets/lottie/refreshSpinner.json'),
    blackListRoutes: [Routes.Onboarding],
  });

const showRefreshDataUpToDate = async () =>
  showToast({
    type: 'success',
    hapticFeedbackOnShow: 'notificationSuccess',
    text: loc._.upToDate,
    testID: 'UpToDateToast',
    duration: 1000,
    blackListRoutes: [Routes.Onboarding],
  });

export const useRefreshStateActions = () => {
  const { fetchAllTokenPrices } = useTokenPriceFetch();
  const { fetchAndUpdateNfts } = useNftsFetch();
  const { fetchAndUpdateTokens } = useTokensFetch();
  const { fetchAndUpdateDefi } = useDefiFetch();
  const { setDidLoadOnce } = useAccountsMutations();
  const { fetchAllTransactionsForAllNetworks } = useTransactionsFetch();
  const isRefreshing = useRef<boolean>();
  const realm = useRealm();
  const accountNumber = useCurrentAccountNumber();
  const timeoutId = useRef<NodeJS.Timeout>();

  const refreshAll = useCallback(
    async (showToastImmediately?: boolean) => {
      if (isRefreshing.current) {
        return;
      }
      const account = realm.objectForPrimaryKey<RealmAccount>(REALM_TYPE_ACCOUNT, accountNumber);
      if (!account) {
        return;
      }
      isRefreshing.current = true;

      const fetchResults: boolean[] = [];
      if (showToastImmediately) {
        await showRefreshLoading();
      } else {
        timeoutId.current = setTimeout(showRefreshLoading, REFRESH_TOAST_TIMEOUT);
      }

      fetchAndUpdateNfts();
      fetchAndUpdateDefi();
      fetchAllTransactionsForAllNetworks();

      if (!account.didLoadOnce) {
        fetchResults.push(await fetchAndUpdateTokens(true));
        if (fetchResults.includes(true)) {
          setDidLoadOnce(account);
        }
        fetchResults.push(await fetchAllTokenPrices());
      } else {
        fetchResults.push(...(await Promise.all([fetchAndUpdateTokens(), fetchAllTokenPrices()])));
      }

      clearTimeout(timeoutId.current);
      hideToast({ id: refreshingAllEvent });
      isRefreshing.current = false;

      if (!fetchResults.includes(false)) {
        showRefreshDataUpToDate();
      }
    },
    [
      accountNumber,
      fetchAllTokenPrices,
      fetchAllTransactionsForAllNetworks,
      fetchAndUpdateDefi,
      fetchAndUpdateNfts,
      fetchAndUpdateTokens,
      realm,
      setDidLoadOnce,
    ],
  );

  return {
    refreshAll,
  };
};
