import { useCallback } from 'react';
import Realm from 'realm';

import { useCurrentAccountNumber } from '../accounts';

import { useRealm } from '../RealmContext';

import { type DappWalletPermissions, REALM_TYPE_DAPP_WALLET_PERMISSIONS } from './schema';

export const useDappPermissionMutations = () => {
  const realm = useRealm();
  const accountNumber = useCurrentAccountNumber();

  const savePermission = useCallback(
    (cleanUrl: string) => {
      const existingBaseUrlPermissionObj = realm.objectForPrimaryKey<DappWalletPermissions>(REALM_TYPE_DAPP_WALLET_PERMISSIONS, cleanUrl);
      realm.write(() => {
        if (existingBaseUrlPermissionObj) {
          const accountIdxs = existingBaseUrlPermissionObj.accountIdxs;
          if (!accountIdxs.includes(accountNumber)) {
            existingBaseUrlPermissionObj.accountIdxs = [...accountIdxs, accountNumber];
          }
        } else {
          realm.create<DappWalletPermissions>(
            REALM_TYPE_DAPP_WALLET_PERMISSIONS,
            {
              accountIdxs: [accountNumber],
              cleanUrl,
              date: Date.now(),
            },
            Realm.UpdateMode.Modified,
          );
        }
      });
    },
    [accountNumber, realm],
  );

  const revokePermissions = useCallback(
    (cleanUrl: string) => {
      const existingBaseUrlPermissionObj = realm.objectForPrimaryKey<DappWalletPermissions>(REALM_TYPE_DAPP_WALLET_PERMISSIONS, cleanUrl);
      if (existingBaseUrlPermissionObj) {
        const accountIdxs = existingBaseUrlPermissionObj.accountIdxs;
        const newAccountIdxs = accountIdxs.filter(idx => idx !== accountNumber);
        realm.write(() => {
          if (newAccountIdxs.length === 0) {
            realm.delete(existingBaseUrlPermissionObj);
          } else {
            existingBaseUrlPermissionObj.accountIdxs = newAccountIdxs;
          }
        });
      }
    },
    [realm, accountNumber],
  );

  return {
    savePermission,
    revokePermissions,
  };
};
