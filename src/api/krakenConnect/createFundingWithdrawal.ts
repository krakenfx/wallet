import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from '@/api/krakenConnect/base/fetchKrakenPrivateApi';

export interface WithdrawParams {
  methodId: string;
  amount: string;
  assetSymbol: string;
  addressId: string;
  feeToken: string;
  tokenId: string;
}

type Params = WithdrawParams & PrivateApiSecureParams;

interface Response {
  fee: {
    amount: string;
    asset: string;
    asset_class: string;
  };
  transaction_id: string;
}

export const createFundingWithdrawal = async ({ assetSymbol, amount, feeToken, methodId, addressId, tokenId, ...secureParams }: Params) => {
  const response = await fetchKrakenPrivateApi<Response>({
    path: '/0/private/CreateFundingWithdrawal',
    method: 'POST',
    tokenId,
    body: {
      method_id: methodId,
      fee_token: feeToken,
      address_id: addressId,
      fee_included: false,
      amount: {
        amount: amount,
        asset: assetSymbol,
      },
    },
    ...secureParams,
  });

  return response.result;
};
