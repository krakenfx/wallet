import { getHarmony } from '../base/apiFactory';

import type { VaultTransactions } from '../types';

import { handleError } from '/helpers/errorHandler';

export async function fetchVaultTransactions(userAddress: string, vaultAddress: string, vaultNetwork: string): Promise<VaultTransactions> {
  try {
    const harmony = await getHarmony();
    const response = await harmony.GET('/v1/defi/vaultTransactions/{network}/{vaultAddress}/{userAddress}', {
      params: {
        path: { network: vaultNetwork, vaultAddress, userAddress },
      },
    });

    return response.content.transactions;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    throw error;
  }
}
