import { getHarmony } from '../base/apiFactory';

import type { ProtocolWithPositions } from '../types';

import { handleError } from '/helpers/errorHandler';

export async function fetchDefiPositions(address: string): Promise<ProtocolWithPositions[]> {
  try {
    const harmony = await getHarmony();
    const response = await harmony.GET('/v1/defi/positions/{address}', {
      params: {
        path: { address },
      },
    });

    return response.content.positions;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    throw error;
  }
}
