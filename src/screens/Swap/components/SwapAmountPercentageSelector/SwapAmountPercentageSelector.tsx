import type React from 'react';

import { useCallback } from 'react';

import { AmountPercentageSelector, type PercentageOption } from '@/components/AmountPercentageSelector/AmountPercentageSelector';
import type { RealmToken } from '@/realm/tokens';
import { SuperBigNumber } from '@/utils/SuperBigNumber';

import { useSwapContext } from '../SwapContext';

export const SwapAmountPercentageSelector: React.FC<{ token: RealmToken }> = ({ token }) => {
  const {
    amountInputFocusState: [isAmountInputFocused],
    updateAmount,
  } = useSwapContext();

  const onSelect = useCallback(
    (o: PercentageOption) => {
      updateAmount(new SuperBigNumber(token.balance).multipliedBy(o).toFixed(0), 'smallestUnit');
    },
    [token.balance, updateAmount],
  );

  return <AmountPercentageSelector onSelect={onSelect} isInputFocused={isAmountInputFocused} />;
};
