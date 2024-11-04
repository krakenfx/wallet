import { REALM_TYPE_ACCOUNT } from '../accounts/schema';
import { useQuery } from '../RealmContext';

import type { RealmAccount } from '../accounts/schema';

export const useAccounts = () => {
  return useQuery<RealmAccount>(REALM_TYPE_ACCOUNT);
};
