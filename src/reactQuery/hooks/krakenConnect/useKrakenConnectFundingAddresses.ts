import { useQuery } from '@tanstack/react-query';

import { fetchFundingAddresses } from '@/api/krakenConnect/fetchFundingAddresses';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

export const useKrakenConnectFundingAddresses = () => {
  const { API_SECRET, API_KEY } = useKrakenConnectCredentials();
  return useQuery({
    queryKey: ['krakenConnectFundingAddresses'],
    queryFn: () => {
      return fetchFundingAddresses({
        apiKey: API_KEY,
        privateKey: API_SECRET,
      });
    },
  });
};
