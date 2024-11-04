import { REALM_TYPE_ACCOUNT } from '../accounts/schema';
import { useObject } from '../RealmContext';

import type { RealmAccount } from '../accounts/schema';

export const useAccountById = <T extends number | undefined>(accountNumber: T) => {
  return useObject<RealmAccount, T>(REALM_TYPE_ACCOUNT, accountNumber, 'accountNumber');
};
