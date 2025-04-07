import { getHarmony } from '../base/apiFactory';

import type { VaultHistoricalMetrics } from '../types';

import { handleError } from '/helpers/errorHandler';

type QueryParams = Partial<{ fromTimestamp: number; toTimestamp: number; granularity: number; perPage: number }>;

export async function fetchVaultHistoricalMetrics(network: string, vaultAddress: string, queryParams?: QueryParams): Promise<VaultHistoricalMetrics> {
  try {
    const harmony = await getHarmony();
    const response = await harmony.GET('/v1/defi/vaultHistoricalMetrics/{network}/{vaultAddress}', {
      params: {
        path: { network, vaultAddress },
        ...(queryParams ? { query: queryParams } : {}),
      },
    });

    return response.content.data;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    throw error;
  }
}
