import { isEmpty } from 'lodash';

import { getHarmony } from '@/api/base/apiFactory';
import type { TokenListsResult } from '@/api/types';

import { handleError } from '/helpers/errorHandler';

export async function fetchTokenLists(): Promise<TokenListsResult['content']> {
  const harmony = await getHarmony();
  try {
    const response = await harmony.GET('/v1/tokenlist', {});
    if (!response.content || isEmpty(response.content)) {
      throw new Error('Empty tokenlist content');
    }
    return response.content;
  } catch (e) {
    handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    throw e;
  }
}
