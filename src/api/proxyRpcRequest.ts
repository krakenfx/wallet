import { getHarmony } from '@/api/base/apiFactory';
import type { RpcMethod } from '@/dAppIntegration/types';

import { handleError } from '/helpers/errorHandler.ts';

export const proxyRpcRequest = async (network: string, method: RpcMethod, params?: unknown[] | object, id?: number) => {
  try {
    const harmony = await getHarmony();
    const response = await harmony.POST('/v1/rpc', {
      body: {
        network,
        request: {
          id,
          jsonrpc: '2.0',
          method,
          params,
        },
      },
    });

    return response.content;
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');

    return {
      jsonrpc: '2.0',
      error: {
        code: 4901,
        message: 'Wallet is not connected to the requested chain',
      },
    };
  }
};
