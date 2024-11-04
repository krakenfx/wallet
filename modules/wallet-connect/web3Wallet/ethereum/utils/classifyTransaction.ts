import type { TransactionEffect } from '@/api/types';
import type { TransactionData} from '@/realm/transactions/getTransactionMetadata';
import { getTransactionMetadata } from '@/realm/transactions/getTransactionMetadata';

export async function classifyTransaction(effects: TransactionEffect[] | undefined): Promise<TransactionData> {
  return getTransactionMetadata({
    effects: effects ?? [],
  });
}
