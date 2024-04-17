import { useMemo } from 'react';
import Realm from 'realm';

import { useQuery } from '../RealmContext';
import { getWalletsForMutations, useRealmWallets } from '../wallets';

import { REALM_TYPE_TOKEN, RealmToken } from './schema';

export const useTokens = (getTokensFromAllWallets?: boolean) => {
  const wallets = useRealmWallets(getTokensFromAllWallets);

  const phrase = useMemo(() => {
    const walletIdString = wallets.map(x => `"${x.id}"`).join(',');
    return `walletId IN {${walletIdString}}`;
  }, [wallets]);

  const collection = useQuery<RealmToken>(REALM_TYPE_TOKEN);
  const filteredCollection = useMemo(() => collection.filtered(phrase), [collection, phrase]);

  return filteredCollection;
};

export const getTokensForMutations = (realm: Realm, getTokensFromAllWallets?: boolean) => {
  const wallets = getWalletsForMutations(realm, getTokensFromAllWallets);
  const tokensCollection = realm.objects<RealmToken>(REALM_TYPE_TOKEN);

  return tokensCollection.filtered(`walletId IN {${wallets.map(x => `"${x.id}"`).join(',')}}`);
};
