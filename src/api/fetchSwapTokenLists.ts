import { getHarmony } from '@/api/base/apiFactory';
import type { SwapFromTokenListResult, SwapToTokenListResult } from '@/api/types';

import { handleError } from '/helpers/errorHandler';

export async function fetchSwapFromTokenList(fromNetworks: string[]): Promise<SwapFromTokenListResult | null> {
  const harmony = await getHarmony();

  try {
    const response = await harmony.GET('/v1/swap/tokenList/from', {
      params: {
        query: {
          fromNetworks,
          isShortList: false,
        },
      },
    });
    return response.content;
  } catch (e) {
    handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    return null;
  }
}

export async function fetchSwapToTokenList(fromNetwork: string, isShortList = true): Promise<SwapToTokenListResult | null> {
  const harmony = await getHarmony();

  try {
    const response = await harmony.GET('/v1/swap/tokenList/to', {
      params: {
        query: {
          fromNetwork,
          isShortList,
        },
      },
    });
    return response.content;
  } catch (e) {
    handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    return null;
  }
}
