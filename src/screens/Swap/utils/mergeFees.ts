import BigNumber from 'bignumber.js';

import type { SwapRouteTXStep } from '@/api/types';

import type { SwapFeeUIData } from '../types';

export function mergeFees(txSteps: SwapRouteTXStep[]): SwapFeeUIData[] {
  const allFees = txSteps.flatMap(step =>
    step.fees.map(fee => ({
      ...fee,
      provider: step.provider,
    })),
  );

  return Object.values(
    allFees.reduce(
      (feeMap, fee, index) => {
        switch (fee.type) {
          case 'bridge': {
            const key = `${fee.type}/${fee.feeAsset.assetId}-${index}`;
            feeMap[key] = {
              key,
              type: fee.type,
              feeAsset: fee.feeAsset,
              provider: fee.provider,
            };
            break;
          }
          case 'gas': {
            const key = `${fee.type}/${fee.feeAsset.assetId}`;
            const amount = feeMap[key]
              ? BigNumber(feeMap[key].feeAsset.amount ?? 0)
                  .plus(fee.feeAsset.amount ?? 0)
                  .toString(10)
              : fee.feeAsset.amount;
            feeMap[key] = {
              key,
              type: fee.type,
              feeAsset: {
                assetId: fee.feeAsset.assetId,
                amount,
              },
            };
          }
        }

        return feeMap;
      },
      {} as Record<string, SwapFeeUIData>,
    ),
  );
}
