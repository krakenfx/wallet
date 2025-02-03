import { useQuery } from '@tanstack/react-query';

import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { fetchNotSupportedAssetPrices } from '@/api/krakenConnect/fetchNotSupportedAssetPrices';
import { Currency } from '@/screens/Settings/currency';
import { calculateBalance } from '@/utils/calculateBalance';

import { useKrakenConnectAssets } from './useKrakenConnectAssets';

export const useKrakenAssetsWithPrices = () => {
  const { data } = useKrakenConnectAssets();

  return useQuery({
    queryKey: ['krakenAssetsWithPrices'],
    enabled: !!data,
    queryFn: async () => {
      if (!data) {
        throw new Error('Kraken assets not available');
      }
      const assetsWithPrices = await Promise.all(
        data.map(async asset => {
          if (asset.isSupported) {
            const price = await fetchPriceForToken(asset.assetId);
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
          const usd = parseFloat(await fetchNotSupportedAssetPrices(asset));
          const balanceInUsd = parseFloat(asset.balance ?? '0') * usd;

          return {
            ...asset,
            price: {},
            balanceInUsd,
          };
        }),
      );
      return assetsWithPrices;
    },
  });
};
