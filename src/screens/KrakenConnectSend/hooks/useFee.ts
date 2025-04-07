import { useCallback } from 'react';

import { fetchWithdrawFee } from '@/api/krakenConnect/fetchWithdrawFee';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

export const useFee = () => {
  const { API_SECRET, API_KEY } = useKrakenConnectCredentials();

  const getFee = useCallback(
    async (amount: string, methodId: string) => {
      return fetchWithdrawFee({ amount: amount, methodId, apiKey: API_KEY, privateKey: API_SECRET });
    },
    [API_KEY, API_SECRET],
  );

  return {
    getFee,
  };
};
