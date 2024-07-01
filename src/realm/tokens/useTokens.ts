import Realm from 'realm';

import { useQuery } from '../RealmContext';
import { getWalletsForMutations, useRealmWallets } from '../wallets';

import { REALM_TYPE_TOKEN, RealmToken } from './schema';

export const useTokens = (getTokensFromAllWallets?: boolean) => {
  const wallets = useRealmWallets(getTokensFromAllWallets);

  return useQuery<RealmToken>(
    REALM_TYPE_TOKEN,
    tokens =>
      tokens.filtered(
        'walletId IN $0',
        wallets.map(w => w.id),
      ),
    [wallets],
  );
};

export const getTokensForMutations = (realm: Realm, getTokensFromAllWallets?: boolean) => {
  const wallets = getWalletsForMutations(realm, getTokensFromAllWallets);
  const tokensCollection = realm.objects<RealmToken>(REALM_TYPE_TOKEN);

  return tokensCollection.filtered(
    'walletId IN $0',
    wallets.map(w => w.id),
  );
};
