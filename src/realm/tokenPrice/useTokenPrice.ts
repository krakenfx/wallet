import { useRealm } from '@realm/react';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { useGlobalState } from '@/components/GlobalState';
import { calculateBalance } from '@/utils/calculateBalance';

import { useDefi } from '../defi';
import { useLocalCacheState } from '../hooks/useLocalCacheState';
import { useRealmQueue } from '../hooks/useRealmQueue';
import { useObject, useQuery } from '../RealmContext';
import { useAppCurrency } from '../settings';
import { useTokens } from '../tokens';
import { getAvailableTokenBalance } from '../tokens/getAvailableTokenBalance';
import { useCurrentUsdFiatRate } from '../usdFiatRates';

import { useIsTokenRelevant } from './isTokenRelevant';
import { FiatValue, REALM_TYPE_TOKEN_PRICE, RealmTokenPrice, TokenPrice } from './schema';
import { useTokenPriceMutations } from './useTokenPriceMutations';

import { handleError } from '/helpers/errorHandler';

const CACHE_KEY = 'tokenPrice';

export interface PriceProps {
  assetId?: string;
  refresh?: boolean;
  realmQueueName?: string;
}


export const useTokenPriceFiatValue = ({ assetId, realmQueueName, refresh }: PriceProps): FiatValue | undefined => {
  
  const tokenPrice = useObject<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, assetId, 'assetId');
  const { setTokenPrice } = useTokenPriceMutations();
  const { currency } = useAppCurrency();
  const { setShouldUseCache } = useLocalCacheState(assetId);
  const { addToRealmTransactionQueue, getFromLocalCache, saveInLocalCache } = useRealmQueue();
  const localCacheValue = assetId && realmQueueName ? getFromLocalCache<TokenPrice>(realmQueueName, CACHE_KEY, assetId) : undefined;
  const [isRefreshing] = useGlobalState('isRefreshing');
  const didFetch = useRef<boolean>();

  useEffect(() => {
    const fetchAndSetTokenPrice = async () => {
      if (assetId) {
        try {
          const price = await fetchPriceForToken(assetId);
          if (realmQueueName) {
            if (assetId) {
              saveInLocalCache<TokenPrice>(realmQueueName, CACHE_KEY, assetId, price);
              setShouldUseCache(true);
            }
            addToRealmTransactionQueue(realmQueueName, () => setTokenPrice(price));
          } else {
            setTokenPrice(price);
          }
        } catch (e) {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        }
      }
    };
    if ((!tokenPrice || (refresh && !didFetch.current)) && !localCacheValue && !isRefreshing) {
      didFetch.current = true;
      fetchAndSetTokenPrice();
    }
  }, [
    setTokenPrice,
    assetId,
    tokenPrice,
    refresh,
    realmQueueName,
    addToRealmTransactionQueue,
    saveInLocalCache,
    localCacheValue,
    setShouldUseCache,
    isRefreshing,
  ]);

  return useMemo(() => {
    return localCacheValue?.fiatValue[currency] ?? tokenPrice?.fiatValue[currency];
  }, [currency, localCacheValue, tokenPrice?.fiatValue]);
};


export const useTokenPrice = ({ assetId, realmQueueName, refresh }: PriceProps): number | undefined => {
  const fiatValue = useTokenPriceFiatValue({ assetId, realmQueueName, refresh });
  return fiatValue?.value !== undefined ? parseFloat(fiatValue.value) : undefined;
};


export const useTokenPriceChangePercentage = ({ assetId, realmQueueName, refresh }: PriceProps): number | undefined => {
  const fiatValue = useTokenPriceFiatValue({ assetId, realmQueueName, refresh });
  return fiatValue?.changePercentage24HR !== undefined ? parseFloat(fiatValue.changePercentage24HR) : undefined;
};


export const useTokenPriceGetter = () => {
  const realm = useRealm();
  const { currency } = useAppCurrency();

  const getTokenPrice = useCallback(
    (token: string): number | undefined => {
      const tokenPrice = realm.objectForPrimaryKey<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE, token);
      const value = tokenPrice?.fiatValue[currency]?.value;
      return value !== undefined ? parseFloat(value) : undefined;
    },
    [realm, currency],
  );

  return {
    getTokenPrice,
  };
};

export const useTokenPrices = () => {
  return useQuery<RealmTokenPrice>(REALM_TYPE_TOKEN_PRICE);
};


export const useDefiNonTokenizedPositionsTotalBalance = (): number => {
  const defis = useDefi();
  return useMemo(() => {
    try {
      return defis
        .flatMap(d =>
          d.products?.flatMap(prd =>
            prd.positions?.map(pos => {
              try {
                return pos.type === 'app-token' ? 0 : +pos.usdValue;
              } catch (e) {
                return 0;
              }
            }),
          ),
        )
        .reduce((prev, cur) => prev + cur, 0);
    } catch (e) {
      return 0;
    }
  }, [defis]);
};

export const useTotalWalletBalance = (): number => {
  const tokens = useTokens();
  const totalDefiUsdSum = useDefiNonTokenizedPositionsTotalBalance();
  const usdFiatRate = useCurrentUsdFiatRate();
  const isTokenRelevant = useIsTokenRelevant();
  const totalDefiSum = usdFiatRate * totalDefiUsdSum;

  const { currency } = useAppCurrency();

  return (
    tokens.filter(isTokenRelevant).reduce((accumulator, token) => {
      const realTokenBalance = getAvailableTokenBalance(token);
      const realmPrice = token.price?.fiatValue[currency]?.value;
      let price: number = realmPrice !== undefined ? parseFloat(realmPrice) : 0;
      price = !isNaN(price) ? price : 0;
      let balance = calculateBalance({
        price,
        balance: realTokenBalance,
        decimals: token.metadata.decimals,
      });
      
      balance = balance > 0 ? balance : 0;

      return accumulator + balance;
    }, 0) + totalDefiSum
  );
};
