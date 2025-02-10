import type { KrakenWithdrawMethod } from '@/api/krakenConnect/types';

import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from './base/fetchKrakenPrivateApi';

interface Params extends PrivateApiSecureParams {
  assetSymbol: string;
}

export const fetchWithdrawMethods = async ({ assetSymbol, ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<KrakenWithdrawMethod[]>({
    path: '/0/private/WithdrawMethods',
    body: {
      asset: assetSymbol,
    },
    method: 'POST',
    ...secureParams,
  });
  return response.result;
};
