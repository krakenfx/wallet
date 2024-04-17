import { TRANSACTION_TYPES } from '@/realm/transactions/const';

import { formatTransactionValueAsNegativeOrPositive } from './formatTransactionValueAsNegativeOrPositive';

import { amountInTokenUnitShortened } from '/modules/text-utils';

type NftTransactionType =
  | TRANSACTION_TYPES.NFT_BUY
  | TRANSACTION_TYPES.NFT_MINT
  | TRANSACTION_TYPES.NFT_RECEIVE
  | TRANSACTION_TYPES.NFT_SELL
  | TRANSACTION_TYPES.NFT_SEND;

type Options = Partial<{
  decimals: number;
  tokenAmount: string;
}>;

export const formatNftAmount = (nftTransactionType: NftTransactionType, { tokenAmount, decimals = 18 }: Options) => {
  if (nftTransactionType === TRANSACTION_TYPES.NFT_RECEIVE) {
    return '';
  }

  const amountShortened_ = amountInTokenUnitShortened(tokenAmount ?? 0, decimals);

  return formatTransactionValueAsNegativeOrPositive(amountShortened_, nftTransactionType);
};
