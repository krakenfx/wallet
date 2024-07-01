import Realm from 'realm';

import { useQuery } from '../RealmContext';
import { getWalletsForMutations, useRealmWallets } from '../wallets';

import { REALM_TYPE_DEFI, RealmDefi } from './schema';

export const useDefi = () => {
  const wallets = useRealmWallets();

  return useQuery<RealmDefi>(
    REALM_TYPE_DEFI,
    defi =>
      defi
        .filtered(
          'walletId IN $0',
          wallets.map(w => w.id),
        )
        .filtered('products.@count != 0')
        .sorted('protocolUsdBalance', true),
    [wallets],
  );
};

export const getDefisForMutations = (realm: Realm) => {
  const wallets = getWalletsForMutations(realm);
  return realm.objects<RealmDefi>(REALM_TYPE_DEFI).filtered(
    'walletId IN $0',
    wallets.map(w => w.id),
  );
};
