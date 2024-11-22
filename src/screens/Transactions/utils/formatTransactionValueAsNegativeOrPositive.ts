import { TRANSACTION_TYPES } from '@/realm/transactions/const';

const TRANSACTION_TYPES_FORMATTED_AS_NEGATIVE: string[] = [
  TRANSACTION_TYPES.DEPOSIT,
  TRANSACTION_TYPES.MINT,
  TRANSACTION_TYPES.NFT_SEND,
  TRANSACTION_TYPES.NFT_BUY,
  TRANSACTION_TYPES.NFT_MINT,
  TRANSACTION_TYPES.SEND,
];

const TRANSACTION_TYPES_FORMATTED_AS_POSITIVE: string[] = [TRANSACTION_TYPES.TOKEN_APPROVAL, TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED];

export function formatTransactionValueAsNegativeOrPositive(
  value: number | string,
  transactionType: string,
  options?: {
    isSwapSent?: boolean;
    isNetworkFee?: boolean;
  },
) {
  if (value === '0' || value === 0 || value === '-0') {
    return '0';
  }

  if (value === '') {
    return '';
  }

  let stringValue = String(value);

  if (transactionType === TRANSACTION_TYPES.NFT_SELL) {
    return stringValue;
  }

  const shouldFormatAsNegative = TRANSACTION_TYPES_FORMATTED_AS_POSITIVE.includes(transactionType)
    ? false
    : TRANSACTION_TYPES_FORMATTED_AS_NEGATIVE.includes(transactionType) || Boolean(options?.isSwapSent) || Boolean(options?.isNetworkFee);
  const isNegative = stringValue.startsWith('-');

  if (shouldFormatAsNegative && !isNegative) {
    stringValue = '-' + value;
  }

  if (!shouldFormatAsNegative && isNegative) {
    stringValue = stringValue.slice(1);
  }

  return stringValue;
}
