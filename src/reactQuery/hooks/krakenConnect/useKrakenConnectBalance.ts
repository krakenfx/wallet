import { useQuery } from '@tanstack/react-query';

import { useKrakenAssetsWithPrices } from '@/reactQuery/hooks/krakenConnect/useKrakenAssetsWithPrices';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';

export const useKrakenConnectBalance = () => {
  const { data: assetsWithPrices } = useKrakenAssetsWithPrices();
  const fiatRate = useCurrentUsdFiatRate();

  return useQuery({
    queryKey: ['krakenConnectBalance', fiatRate],
    enabled: !!assetsWithPrices,
    queryFn: async () => {
      if (!assetsWithPrices) {
        return 0;
      }
      let totalUsdBalance = 0;
      assetsWithPrices.map(asset => {
        totalUsdBalance += asset.balanceInUsd;
      });
      return totalUsdBalance * fiatRate;
    },
  });
};
