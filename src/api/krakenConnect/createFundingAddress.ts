import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from '@/api/krakenConnect/base/fetchKrakenPrivateApi';

interface Params extends PrivateApiSecureParams {
  network_id: string;
  address: string;
  name?: string;
  description?: string;
}

interface Response {
  id: string;
  verified: boolean;
}

export const createFundingAddress = async ({ network_id, address, name, description, ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<Response>({
    path: '/0/private/CreateFundingAddress',
    method: 'POST',
    body: {
      network_id,
      name,
      description,
      address: {
        address,
        type: 'crypto',
      },
    },
    ...secureParams,
  });

  return response.result;
};
