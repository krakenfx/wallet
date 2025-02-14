import { useCallback } from 'react';

import { type WithdrawParams, createFundingWithdrawal } from '@/api/krakenConnect/createFundingWithdrawal';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

export const useWithdrawMethod = () => {
  const { API_SECRET, API_KEY, CF_TOKEN } = useKrakenConnectCredentials();

  const transfer = useCallback(
    async ({ methodId, amount, assetSymbol, addressId, feeToken }: WithdrawParams) => {
      return createFundingWithdrawal({ amount, addressId, methodId, assetSymbol, feeToken, cfToken: CF_TOKEN, apiKey: API_KEY, privateKey: API_SECRET });
    },
    [API_KEY, API_SECRET, CF_TOKEN],
  );

  return {
    transfer,
  };
};
