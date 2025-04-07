import { getUniqueId } from 'react-native-device-info';

import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from '@/api/krakenConnect/base/fetchKrakenPrivateApi';
import { FUNDING_ADDR_KRAKEN_WALLET_IDENTIFIER, FUNDING_ADDR_KRAKEN_WALLET_IDENTIFIER_DESCRIPTION } from '@/api/krakenConnect/consts';

interface Params extends PrivateApiSecureParams {
  network_id: string;
  address: string;
}

interface Response {
  id: string;
  verified: boolean;
}

export const getAddressNameAndDescriptionForApp = async () => {
  const deviceId = await getUniqueId();

  return {
    name: FUNDING_ADDR_KRAKEN_WALLET_IDENTIFIER,
    description: `${FUNDING_ADDR_KRAKEN_WALLET_IDENTIFIER_DESCRIPTION}${deviceId}`,
  };
};

export const createFundingAddress = async ({ network_id, address, ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<Response>({
    path: '/0/private/CreateFundingAddress',
    method: 'POST',
    body: {
      network_id,

      address: {
        address,
        type: 'crypto',
      },
    },
    ...secureParams,
  });

  return response.result;
};
