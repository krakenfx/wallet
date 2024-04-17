import { TransactionEffect } from '@/api/types';
import { TransactionData, getTransactionMetadata } from '@/realm/transactions/getTransactionMetadata';

export async function classifyTransaction(effects: TransactionEffect[] | undefined): Promise<TransactionData> {
  return getTransactionMetadata({
    effects: effects ?? [],
  });
}
