import type { KrakenWithdrawFee } from '@/api/krakenConnect/types';

import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from './base/fetchKrakenPrivateApi';

interface Params extends PrivateApiSecureParams {
  amount: string;
  methodId: string;
}

export const fetchWithdrawFee = async ({ amount, methodId, ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<KrakenWithdrawFee>({
    path: '/0/private/WithdrawFee',
    body: {
      amount,
      method_id: methodId,
    },
    method: 'POST',
    ...secureParams,
  });
  return response.result;
};
