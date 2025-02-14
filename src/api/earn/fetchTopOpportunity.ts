import type { BestVaultResult } from '@/api/types';

import type { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

import { getHarmony } from '../base/apiFactory';

import { VAULTS_SUPPORTED_NETWORKS } from './utils';

import { handleError } from '/helpers/errorHandler';

interface Options {
  address: string;
  networkCaipId: ChainAgnostic;
}

export async function fetchTopOpportunity({ networkCaipId, address }: Options): Promise<BestVaultResult | null> {
  if (!VAULTS_SUPPORTED_NETWORKS.includes(networkCaipId)) {
    throw new Error(`networkCaipId has to be one of: ${VAULTS_SUPPORTED_NETWORKS.join(', ')}`);
  }

  try {
    const harmony = await getHarmony();
    const response = await harmony.GET('/v1/defi/topOpportunity/{address}', {
      params: {
        path: { address },
        query: { network: networkCaipId as string },
      },
    });

    return response.content as BestVaultResult;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    throw error;
  }
}
