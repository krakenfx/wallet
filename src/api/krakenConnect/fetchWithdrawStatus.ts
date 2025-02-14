import type { KrakenConnectWithdrawStatus } from '@/api/krakenConnect/types';

import { type PrivateApiSecureParams, fetchKrakenPrivateApi } from './base/fetchKrakenPrivateApi';

interface Params extends PrivateApiSecureParams {
  assetSymbol?: string;
  timestamp?: number | null;
  refid: string;
}

const TIME_OFFSET = 60;

const getTimePeriodForTransaction = (timestamp: number) => ({
  start: String(timestamp - TIME_OFFSET),
  end: String(timestamp + TIME_OFFSET),
});

export const fetchWithdrawStatus = async ({ assetSymbol, timestamp, refid, ...secureParams }: Params) => {
  const offset = timestamp ? getTimePeriodForTransaction(timestamp) : undefined;
  const response = await fetchKrakenPrivateApi<KrakenConnectWithdrawStatus[]>({
    path: '/0/private/WithdrawStatus',
    body: {
      asset: assetSymbol,
      start: offset?.start,
      end: offset?.end,
    },
    method: 'POST',
    ...secureParams,
  });

  if (response.result && response.result.length > 0) {
    const tx = response.result.find(transaction => transaction.refid.toLowerCase() === refid.toLowerCase());
    if (tx) {
      return { status: tx.status.toLowerCase(), transactionId: tx.txid };
    }
  }
  return {
    status: null,
    transactionId: null,
  };
};
