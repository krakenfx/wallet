import { useQuery } from '@tanstack/react-query';

import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { fetchNotSupportedAssetPrices } from '@/api/krakenConnect/fetchNotSupportedAssetPrices';
import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';
import { useTokenPriceMutations } from '@/realm/tokenPrice';
import { useCurrentUsdFiatRate, useGetFiatRateForCurrency } from '@/realm/usdFiatRates';
import { Currency } from '@/screens/Settings/currency';
import { calculateBalance } from '@/utils/calculateBalance';

import { useKrakenConnectAssets } from './useKrakenConnectAssets';

export const useKrakenAssetsWithPrices = () => {
  const { data, refetchKrakenBalance } = useKrakenConnectAssets();
  const fiatRate = useCurrentUsdFiatRate();
  const { getFiatRateForCurrency } = useGetFiatRateForCurrency();

  const { setTokenPrice } = useTokenPriceMutations();
  const { runInTransaction } = useRealmTransaction();

  const { CF_TOKEN } = useKrakenConnectCredentials();

  const query = useQuery({
    queryKey: ['krakenAssetsWithPrices', fiatRate],
    enabled: !!data,
    queryFn: async () => {
      if (!data) {
        throw new Error('Kraken assets not available');
      }

      const queue: (() => unknown)[] = [];

      const setAllPricesToRealm = () => {
        runInTransaction(() => {
          for (const callback of queue) {
            callback();
          }
        });
        queue.length = 0;
      };

      const assetsWithPrices = await Promise.all(
        data.map(async asset => {
          if (asset.isSupported) {
            const price = await fetchPriceForToken(asset.assetId);
            queue.push(() => setTokenPrice(price));
            const usd = price.fiatValue[Currency.USD].value ? parseFloat(price.fiatValue[Currency.USD].value) : 0;
            const balanceInUsd = calculateBalance({
              price: usd,
              balance: asset.balance,
              decimals: asset.metadata.decimals,
            });
            return {
              ...asset,
              price: price,
              balanceInUsd,
            };
          }
          let usdRate = 0;
          const usdTickerPrice = await fetchNotSupportedAssetPrices(asset, CF_TOKEN);
          if (usdTickerPrice !== null) {
            usdRate = parseFloat(usdTickerPrice);
          } else if (Object.keys(Currency).includes(asset.symbol)) {
            const assetFiatRate = getFiatRateForCurrency(asset.symbol as Currency);
            if (assetFiatRate) {
              usdRate = parseFloat(assetFiatRate.value);
            } else if (asset.symbol === Currency.USD) {
              usdRate = 1;
            }
          }
          const balanceInUsd = parseFloat(asset.balance ?? '0') * usdRate;

          return {
            ...asset,
            price: {},
            balanceInUsd,
          };
        }),
      );
      setAllPricesToRealm();
      return assetsWithPrices;
    },
  });

  return {
    ...query,
    refetchPrices: query.refetch,
    refetchKrakenBalance,
  };
};
