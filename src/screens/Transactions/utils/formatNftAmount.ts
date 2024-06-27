import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import { Currency } from '@/screens/Settings/currency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { formatTransactionValueAsNegativeOrPositive } from './formatTransactionValueAsNegativeOrPositive';

type NftTransactionType =
  | TRANSACTION_TYPES.NFT_BUY
  | TRANSACTION_TYPES.NFT_MINT
  | TRANSACTION_TYPES.NFT_RECEIVE
  | TRANSACTION_TYPES.NFT_SELL
  | TRANSACTION_TYPES.NFT_SEND;

type Options = {
  currency: Currency;
  decimals?: number;
  tokenAmount?: string;
  assetId: string;
};

export const formatNftAmount = (nftTransactionType: NftTransactionType, { tokenAmount, decimals = 18, currency, assetId }: Options) => {
  if (nftTransactionType === TRANSACTION_TYPES.NFT_RECEIVE) {
    return '';
  }
  const tokenAmountInTokenUnit = unitConverter.smallUnit2TokenUnit(tokenAmount ?? 0, decimals).toString(10);
  const tokenAmountFormatted = formatTokenAmount(tokenAmountInTokenUnit, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId }) });

  return formatTransactionValueAsNegativeOrPositive(tokenAmountFormatted, nftTransactionType);
};
