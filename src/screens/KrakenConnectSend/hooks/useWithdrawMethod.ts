import { useCallback } from 'react';

import { type WithdrawParams, createFundingWithdrawal } from '@/api/krakenConnect/createFundingWithdrawal';
import { useKrakenConnectCredentials } from '@/realm/krakenConnect/useKrakenConnectCredentials';

export const useWithdrawMethod = () => {
  const { API_SECRET, API_KEY } = useKrakenConnectCredentials();

  const transfer = useCallback(
    async ({ methodId, amount, assetSymbol, addressId, feeToken, tokenId }: WithdrawParams) => {
      return createFundingWithdrawal({
        amount,
        addressId,
        methodId,
        assetSymbol,
        feeToken,
        apiKey: API_KEY,
        privateKey: API_SECRET,
        tokenId,
      });
    },
    [API_KEY, API_SECRET],
  );

  return {
    transfer,
  };
};
