import BigNumber from 'bignumber.js';

import { fetchSwapQuote } from '@/api/fetchSwapQuote';
import type { SwapQuoteRequest } from '@/api/types';

import { mergeFees } from './mergeFees';

export async function fetchQuote(body: SwapQuoteRequest, deduceGasFee?: boolean) {
  if (!deduceGasFee) {
    return fetchSwapQuote(body);
  }

  const result = await fetchSwapQuote(body);
  if (!result) {
    return result;
  }

  const gasFeeAmount = mergeFees(result.quote.route.txSteps).find(fee => fee.type === 'gas')?.feeAsset.amount;

  if (!gasFeeAmount) {
    return result;
  }

  const diff = new BigNumber(gasFeeAmount).multipliedBy(1.01).toFixed(0);
  const deducedAmount = new BigNumber(body.from.amount).minus(diff).toString(10);
  const newBody: SwapQuoteRequest = {
    ...body,
    from: {
      ...body.from,
      amount: deducedAmount,
    },
  };

  return fetchSwapQuote(newBody);
}
