import { getHarmony } from '@/api/base/apiFactory';
import type { SwapQuoteRequest, SwapQuoteResult } from '@/api/types';

import { handleError } from '/helpers/errorHandler';

export async function fetchSwapQuote(body: SwapQuoteRequest): Promise<SwapQuoteResult | null> {
  const harmony = await getHarmony();

  try {
    const response = await harmony.POST('/v1/swap/quote', { body });
    return response.content;
  } catch (e) {
    handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    return null;
  }
}
