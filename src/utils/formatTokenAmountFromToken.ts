import { getAvailableTokenBalance } from '@/realm/tokens';
import { unitConverter } from '@/utils/unitConverter';

import { FormatTokenAmountOptions, formatTokenAmount } from './formatTokenAmount';

type Token = {
  balance: string;
  metadata: {
    decimals: number;
  };
};

export const formatTokenAmountFromToken = (token: Token, options: FormatTokenAmountOptions) => {
  const tokenBalance = getAvailableTokenBalance(token);
  const tokenAmount = unitConverter.smallUnit2TokenUnit(tokenBalance, token.metadata.decimals).toString(10);

  return formatTokenAmount(tokenAmount, options);
};
