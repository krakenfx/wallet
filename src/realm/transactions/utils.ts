import type { Transaction } from '@/api/types';

export const getCombinedTransactionId = (walletId: string, txId: string) => `${walletId}:${txId}`;

export function convertToTimestamp(timestamp: string | number): number {
  if (typeof timestamp === 'string' && timestamp.startsWith('0x')) {
    return parseInt(timestamp, 16);
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }

  throw new Error('Invalid timestamp format');
}

export function memoizedJSONParseTx(str: string): Transaction {
  if (!memoizedJSONParseTx.cache) {
    memoizedJSONParseTx.cache = new Map<string, Transaction>();
  }

  if (!memoizedJSONParseTx.cache.has(str)) {
    const parsedJson = JSON.parse(str);
    memoizedJSONParseTx.cache.set(str, parsedJson);
    return parsedJson;
  }

  return memoizedJSONParseTx.cache.get(str)!;
}
memoizedJSONParseTx.cache = new Map<string, Transaction>();
