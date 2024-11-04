import React from 'react';

import { CardWarning } from '@/components/CardWarning';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';

import { formatCurrency } from '@/utils/formatCurrency';

import type BigNumber from 'bignumber.js';

import loc from '/loc';

const feePercentageThreshold = 0.1;
const feeLimit = 30;

export type FeeAmountWarningProps = {
  transferToAmount: BigNumber;
  feeAmount: BigNumber;
};

export const FeeAmountWarning = React.memo(({ transferToAmount, feeAmount }: FeeAmountWarningProps) => {
  const isAbovePercentageThreshold = feeAmount.dividedBy(transferToAmount).isGreaterThan(feePercentageThreshold);
  const isAboveAmountThreshold = feeAmount.isGreaterThan(feeLimit);
  const { currency } = useAppCurrency();

  if (!isAbovePercentageThreshold && !isAboveAmountThreshold) {
    return null;
  }

  const args = {
    feeAmount: formatCurrency(feeAmount.toString(10), { currency }),
    percentage: feePercentageThreshold * 100,
  };

  return <CardWarning iconSize={18} type="info" description={loc.formatString(loc.send.feeWarning, args).toString()} />;
});
