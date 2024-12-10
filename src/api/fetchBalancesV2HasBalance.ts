import { getHarmony } from './base/apiFactory.ts';

import { handleError } from '/helpers/errorHandler.ts';

export async function fetchBalancesV2HasBalance(caip10Accounts: string[]) {
  try {
    const harmony = await getHarmony();
    const response = await harmony.POST('/v2/balances', {
      body: {
        caip10Accounts,
        hasBalance: true,
      },
    });

    return response.content as Record<string, boolean>;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    return {};
  }
}
