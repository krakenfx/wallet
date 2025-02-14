import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from './base/fetchKrakenPrivateApi';
import { fetchFundingAddresses } from './fetchFundingAddresses';

export const deleteFundingAddresses = async ({ ...secureParams }: PrivateApiSecureParams) => {
  const addresses = await fetchFundingAddresses(secureParams);

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
    for (const address of addresses) {
      await deleteAddress(address.id);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return true;
};
