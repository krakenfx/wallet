import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from '@/api/krakenConnect/base/fetchKrakenPrivateApi';
import type { KrakenConnectFundingAddress } from '@/api/krakenConnect/types';

interface Params extends PrivateApiSecureParams {}

interface Response {
  items: KrakenConnectFundingAddress[];
}

export const fetchFundingAddresses = async ({ ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<Response>({
    path: '/0/private/ListFundingAddresses',
    method: 'POST',
    ...secureParams,
  });
  return response.result?.items || [];
};
