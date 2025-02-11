import { getHarmony } from '@/api/base/apiFactory';

import type { components } from '/generated/harmony.ts';
import { handleError } from '/helpers/errorHandler.ts';

export const proxyRpcRequest = async (
  network: string,
  method: string,
  params?: unknown[] | object,
  id?: number,
): Promise<components['schemas']['RpcRequestResult']> => {
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
      jsonrpc: '2.0' as const,
      error: {
        code: 4901,
        message: 'Wallet is not connected to the requested chain',
      },
    };
  }
};
