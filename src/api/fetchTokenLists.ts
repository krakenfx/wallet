import { getHarmony } from '@/api/base/apiFactory';
import type { TokenListsResult } from '@/api/types';

import { handleError } from '/helpers/errorHandler';

export async function fetchTokenLists(): Promise<TokenListsResult | null> {
  const harmony = await getHarmony();

  const response: TokenListsResult | null = await harmony.GET('/v1/tokenlist', {}).catch(err => {
    handleError(err, 'ERROR_CONTEXT_PLACEHOLDER');
    return null;
  });

  return response;
}
