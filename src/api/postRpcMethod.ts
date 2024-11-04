import { getHarmony } from '@/api/base/apiFactory';
import type { RpcMethods } from '@/dAppIntegration/types';
import type { RealmishWallet } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';

export const postRpcMethod = async (wallet: RealmishWallet, method: RpcMethods, params: unknown[]) => {
  const { network } = getImplForWallet(wallet);
  const harmony = await getHarmony();

  const response = await harmony.POST('/v1/rpc', {
    body: {
      network: network.caipId,
      request: {
        jsonrpc: '2.0',
        method,
        params,
      },
    },
  });

  if ('result' in response.content) {
    return response.content.result;
  }
  throw new Error('Call RPC method failed');
};
