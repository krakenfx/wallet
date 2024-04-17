import { useObject } from '../RealmContext';

import { REALM_TYPE_PENDING_TRANSACTION, RealmPendingTransaction } from './schema';

export const usePendingTransactionById = (id: string) => {
  return useObject<RealmPendingTransaction>(REALM_TYPE_PENDING_TRANSACTION, id, 'id');
};
