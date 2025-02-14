import { useQuery } from '@tanstack/react-query';

import { fetchFundingAddresses } from '@/api/krakenConnect/fetchFundingAddresses';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

export const useKrakenConnectFundingAddresses = () => {
  const { API_SECRET, API_KEY, CF_TOKEN } = useKrakenConnectCredentials();
  return useQuery({
    queryKey: ['krakenConnectFundingAddresses'],
    queryFn: () => {
      return fetchFundingAddresses({
        cfToken: CF_TOKEN,
        apiKey: API_KEY,
        privateKey: API_SECRET,
      });
    },
  });
};
