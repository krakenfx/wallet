import { useCallback } from 'react';
import Realm from 'realm';

import type { DeFiProtocol } from '@/api/types';

import { useRealm } from '../RealmContext';

import { REALM_TYPE_DEFI } from './schema';
import { getDefisForMutations } from './useDefi';

import type { Defi, RealmDefi } from './schema';
import type { RealmWallet } from '../wallets';

import { handleError } from '/helpers/errorHandler';

export const useDefiMutations = () => {
  const realm = useRealm();
  const saveDefis = useCallback(
    (records: DeFiProtocol[], wallet: RealmWallet) => {
      realm.write(() => {
        const toDelete = getDefisForMutations(realm).filtered(
          `walletId = "${wallet.id}" AND NOT id IN $0`,
          records.map(r => r.id),
        );
        realm.delete(toDelete); 

        for (const record of records) {
          try {
            realm.create<RealmDefi>(REALM_TYPE_DEFI, { ...(record as Defi), walletId: wallet.id, wallet }, Realm.UpdateMode.Modified);
          } catch (e) {
            
            handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
          }
        }
      });
    },
    [realm],
  );

  return {
    saveDefis,
  };
};
