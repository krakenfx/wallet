import { REALM_TYPE_ACCOUNT, RealmAccount } from '../accounts/schema';
import { useObject } from '../RealmContext';

export const useAccountById = <T extends number | undefined>(accountNumber: T) => {
  return useObject<RealmAccount, T>(REALM_TYPE_ACCOUNT, accountNumber, 'accountNumber');
};
