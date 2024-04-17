import { REALM_TYPE_ACCOUNT, RealmAccount } from '../accounts/schema';
import { useQuery } from '../RealmContext';

export const useAccounts = () => {
  return useQuery<RealmAccount>(REALM_TYPE_ACCOUNT);
};
