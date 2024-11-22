import { useMemo } from 'react';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { useObject } from '@/realm/RealmContext';

import { REALM_TYPE_DAPP_WALLET_PERMISSIONS } from './schema';

import type { DappWalletPermissions } from './schema';

export const useDappPermissions = (cleanUrl: string | null): boolean => {
  const accountNumber = useCurrentAccountNumber();
  const dappWalletPermissionsObj = useObject<DappWalletPermissions>(REALM_TYPE_DAPP_WALLET_PERMISSIONS, cleanUrl ?? '', 'cleanUrl');

  return useMemo(() => {
    return !!(cleanUrl && dappWalletPermissionsObj && dappWalletPermissionsObj.accountIdxs.includes(accountNumber));
  }, [accountNumber, cleanUrl, dappWalletPermissionsObj]);
};
