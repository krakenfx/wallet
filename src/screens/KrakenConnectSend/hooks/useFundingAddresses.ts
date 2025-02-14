import { useCallback } from 'react';

import { createFundingAddress } from '@/api/krakenConnect/createFundingAddress';
import { useKrakenConnectFundingAddresses } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectFundingAddresses';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

export const useFundingAddresses = () => {
  const { API_SECRET, API_KEY, CF_TOKEN } = useKrakenConnectCredentials();
  const { data: fundingAddresses, isFetched, refetch } = useKrakenConnectFundingAddresses();

  const createNewFundingAddress = useCallback(
    async (networkId: string, address: string) => {
      const response = await createFundingAddress({
        network_id: networkId,
        address,
        cfToken: CF_TOKEN,
        apiKey: API_KEY,
        privateKey: API_SECRET,
      });
      refetch();
      return response?.id;
    },
    [API_KEY, API_SECRET, CF_TOKEN, refetch],
  );

  const getExistingFundingAddress = useCallback(
    (networkId: string, address: string) => {
      return fundingAddresses?.find(
        fundingAddress =>
          fundingAddress.network_id.toLowerCase() === networkId.toLowerCase() && fundingAddress.address.address.toLowerCase() === address.toLowerCase(),
      );
    },
    [fundingAddresses],
  );

  const getOrCreateFundingAddress = useCallback(
    async (networkId: string, address: string) => {
      if (!isFetched) {
        refetch();
        return undefined;
      }
      const existing = getExistingFundingAddress(networkId, address);
      if (existing) {
        return existing.id;
      }
      const id = await createNewFundingAddress(networkId, address);
      return id;
    },
    [createNewFundingAddress, getExistingFundingAddress, isFetched, refetch],
  );

  return {
    getOrCreateFundingAddress,
  };
};
