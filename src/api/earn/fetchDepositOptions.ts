import type { DepositOptionsResult } from '@/api/types';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { Networks } from '@/onChain/wallets/registry';

import { getHarmony } from '../base/apiFactory';

import { handleError } from '/helpers/errorHandler';

const evmNetworks = Object.values(Networks)
  .filter(n => n instanceof EVMNetwork)
  .map(n => n.caipId);

interface Options {
  address: string;
  networkCaipIds?: string[];
  maxVaultsPerAsset?: number;
  minimumBalanceThreshold?: number;
  minApy?: number;
}

export async function fetchDepositOptions({
  address,
  networkCaipIds = [],
  minimumBalanceThreshold = 0,
  maxVaultsPerAsset = 1,
  minApy = 200,
}: Options): Promise<DepositOptionsResult> {
  try {
    const harmony = await getHarmony();
    const response = await harmony.POST('/v1/defi/opportunities/{address}', {
      params: { path: { address } },
      body: {
        allowedNetworks: networkCaipIds?.length > 0 ? networkCaipIds : evmNetworks,
        maxVaultsPerAsset,
        minimumBalanceThreshold,
        minimumVaultTvl: 10000000,
        minApy,
      },
    });

    return response.content as DepositOptionsResult;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    throw error;
  }
}
