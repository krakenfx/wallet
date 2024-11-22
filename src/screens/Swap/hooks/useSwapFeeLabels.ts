import { useMemo } from 'react';

import type { RouteDetailsRowProps } from '../components/RouteDetailsRow';
import type { SwapRouteUIData } from '../types';

import loc from '/loc';

export const useSwapFeeLabels = (fees: SwapRouteUIData['fees']): RouteDetailsRowProps[] => {
  return useMemo(
    () =>
      fees.map(fee => {
        return {
          labelLeft: fee.type === 'gas' ? loc.swap.route.networkFee.title : loc.swap.route.bridgeCost.title,
          tooltipText: fee.type === 'gas' ? loc.swap.route.networkFee.hint : loc.swap.route.bridgeCost.hint,
          feeDetails: {
            key: fee.key,
            assetId: fee.feeAsset.assetId,
            amount: fee.feeAsset.amount,
            iconProps:
              fee.type === 'bridge'
                ? {
                    type: 'image',
                    uri: fee.provider.icon,
                  }
                : {
                    type: 'asset',
                    assetId: fee.feeAsset.assetId,
                  },
          },
        } satisfies RouteDetailsRowProps;
      }),
    [fees],
  );
};
