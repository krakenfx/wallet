import { useMemo } from 'react';

import { useQuery } from '../RealmContext';
import { getWalletsForMutations, useRealmWallets } from '../wallets';

import { REALM_TYPE_DEFI, RealmDefi } from './schema';

export const useDefi = () => {
  const wallets = useRealmWallets();

  const phrase = useMemo(() => {
    const walletIdString = wallets.map(x => `"${x.id}"`).join(',');
    return `walletId IN {${walletIdString}}`;
  }, [wallets]);

  const collection = useQuery<RealmDefi>(REALM_TYPE_DEFI);

  return useMemo(() => {
    return collection.filtered(phrase).filtered('products.@count != 0').sorted('protocolUsdBalance', true);
  }, [collection, phrase]);
};

export const getDefisForMutations = (realm: Realm) => {
  const wallets = getWalletsForMutations(realm);
  const defiCollection = realm.objects<RealmDefi>(REALM_TYPE_DEFI);
  return defiCollection.filtered(`walletId IN {${wallets.map(x => `"${x.id}"`).join(',')}}`);
};
