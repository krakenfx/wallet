import EventEmitter from 'eventemitter3';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';

import { useGlobalState } from '@/components/GlobalState';
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

const DELAY_REFRESH_TRANSACTION_FIRST_CALL = 3000;
const DELAY_REFRESH_TRANSACTION_ADDITIONAL_CALL = 15000;
export const refreshAllTransactions = debounce(() => {
  setTimeout(() => refreshEmitter.emit(RefreshEmitter.refreshAllTransactions), DELAY_REFRESH_TRANSACTION_FIRST_CALL);
  setTimeout(() => refreshEmitter.emit(RefreshEmitter.refreshAllTransactions), DELAY_REFRESH_TRANSACTION_ADDITIONAL_CALL);
}, DEBOUNCE_FETCH_TIME);

export const useRegisterRefreshManager = () => {
  const { fetchRelevantTokenPrices } = useTokenPriceFetch();
  const { fetchAndUpdateNfts } = useNftsFetch();
  const { fetchAndUpdateTokens } = useTokensFetch();
  const { fetchAllTransactionsForAllNetworks } = useTransactionsFetch();

  useEffect(() => {
    refreshEmitter.on(RefreshEmitter.refreshAllTokens, fetchAndUpdateTokens);
    refreshEmitter.on(RefreshEmitter.refreshAllNfts, fetchAndUpdateNfts);
    refreshEmitter.on(RefreshEmitter.refreshTokenPrices, fetchRelevantTokenPrices);
    refreshEmitter.on(RefreshEmitter.refreshAllTransactions, fetchAllTransactionsForAllNetworks);

    return () => {
      refreshEmitter.off(RefreshEmitter.refreshAllTokens, fetchAndUpdateTokens);
      refreshEmitter.off(RefreshEmitter.refreshAllNfts, fetchAndUpdateNfts);
      refreshEmitter.off(RefreshEmitter.refreshTokenPrices, fetchRelevantTokenPrices);
      refreshEmitter.off(RefreshEmitter.refreshAllTransactions, fetchAllTransactionsForAllNetworks);
    };
  }, [fetchRelevantTokenPrices, fetchAndUpdateNfts, fetchAndUpdateTokens, fetchAllTransactionsForAllNetworks]);
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
  const { fetchRelevantTokenPrices } = useTokenPriceFetch();
  const { fetchAndUpdateNfts } = useNftsFetch();
  const { fetchAndUpdateTokens } = useTokensFetch();
  const { fetchAndUpdateDefi } = useDefiFetch();
  const { setDidLoadOnce } = useAccountsMutations();
  const { fetchAllTransactionsForAllNetworks } = useTransactionsFetch();
  const [_, setIsRefreshing] = useGlobalState('isRefreshing');

  const realm = useRealm();
  const accountNumber = useCurrentAccountNumber();
  const timeoutId = useRef<NodeJS.Timeout>();
  const preventRefresh = useRef<boolean>();

  const refreshAll = useCallback(
    async (showToastImmediately?: boolean) => {
      if (preventRefresh.current) {
        return;
      }
      const account = realm.objectForPrimaryKey<RealmAccount>(REALM_TYPE_ACCOUNT, accountNumber);
      if (!account) {
        return;
      }
      setIsRefreshing(true);
      preventRefresh.current = true;

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
        fetchResults.push(await fetchRelevantTokenPrices());
      } else {
        fetchResults.push(...(await Promise.all([fetchAndUpdateTokens(), fetchRelevantTokenPrices()])));
      }

      clearTimeout(timeoutId.current);
      hideToast({ id: refreshingAllEvent });
      setIsRefreshing(false);
      preventRefresh.current = false;

      if (!fetchResults.includes(false)) {
        showRefreshDataUpToDate();
      }
    },
    [
      realm,
      accountNumber,
      setIsRefreshing,
      fetchAndUpdateNfts,
      fetchAndUpdateDefi,
      fetchAllTransactionsForAllNetworks,
      fetchAndUpdateTokens,
      fetchRelevantTokenPrices,
      setDidLoadOnce,
    ],
  );

  return {
    refreshAll,
  };
};
