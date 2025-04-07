import { getUniqueId } from 'react-native-device-info';

import { FUNDING_ADDR_KRAKEN_WALLET_IDENTIFIER } from '@/api/krakenConnect/consts';
import type { KrakenConnectFundingAddress } from '@/api/krakenConnect/types';

import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from './base/fetchKrakenPrivateApi';
import { fetchFundingAddresses } from './fetchFundingAddresses';

interface Params extends PrivateApiSecureParams {
  deleteAll?: boolean;
}

export const deleteFundingAddresses = async ({ deleteAll, ...secureParams }: Params) => {
  const addresses = await fetchFundingAddresses(secureParams);
  const deviceId = await getUniqueId();

  const deleteAddress = async (id: string) => {
    const response = await fetchKrakenPrivateApi({
      path: '/0/private/DeleteFundingAddress',
      method: 'POST',
      body: {
        id,
      },
      ...secureParams,
    });
    return response.result;
  };

  try {
    let addressesToDelete: KrakenConnectFundingAddress[] = [];
    if (deleteAll) {
      addressesToDelete = addresses;
    } else {
      addressesToDelete = addresses.filter(address => address.name === FUNDING_ADDR_KRAKEN_WALLET_IDENTIFIER && address.description?.includes(deviceId));
    }

    for (const address of addressesToDelete) {
      await deleteAddress(address.id);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return true;
};
