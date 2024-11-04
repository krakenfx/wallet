import { getHarmony } from './base/apiFactory.ts';

import { handleError } from '/helpers/errorHandler.ts';

export async function analyseUrl(url: string, caip10Accounts?: string[]) {
  try {
    const harmony = await getHarmony();
    const response = await harmony.POST('/v1/analyse/url', {
      body: {
        url,
        caip10Accounts,
      },
    });

    return response.content;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    return {
      url,
      isMalicious: null,
    };
  }
}
