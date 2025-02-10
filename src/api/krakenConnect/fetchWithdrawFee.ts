import type { KrakenWithdrawFee } from '@/api/krakenConnect/types';

import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from './base/fetchKrakenPrivateApi';

interface Params extends PrivateApiSecureParams {
  assetSymbol: string;
  amount: string;
  methodName: string;
}

export const fetchWithdrawFee = async ({ assetSymbol, amount, methodName, ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<KrakenWithdrawFee>({
    path: '/0/private/WithdrawFee',
    body: {
      asset: assetSymbol,
      amount,
      method: methodName,
      asset_class: 'currency',
    },
    method: 'POST',
    ...secureParams,
  });
  return response.result;
};
