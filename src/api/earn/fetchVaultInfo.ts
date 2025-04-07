import { getHarmony } from '../base/apiFactory';

import type { VaultInfo } from '../types';

import { handleError } from '/helpers/errorHandler';

export async function fetchVaultInfo(network: string, vaultAddress: string): Promise<VaultInfo> {
  try {
    const harmony = await getHarmony();
    const response = await harmony.GET('/v1/defi/vaultInfo/{network}/{vaultAddress}', {
      params: {
        path: { network, vaultAddress },
      },
    });

    return response.content;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    throw error;
  }
}
