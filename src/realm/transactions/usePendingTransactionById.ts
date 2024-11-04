import { useObject } from '../RealmContext';

import { REALM_TYPE_PENDING_TRANSACTION } from './schema';

import type { RealmPendingTransaction } from './schema';

export const usePendingTransactionById = (id: string) => {
  return useObject<RealmPendingTransaction>(REALM_TYPE_PENDING_TRANSACTION, id, 'id');
};
