import { NEW_NETWORKS, isNewNetworksEnabled } from '@/utils/featureFlags';

import { useCurrentAccountNumber } from '../accounts';
import { useQuery } from '../RealmContext';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from '../settings';

import { REALM_TYPE_WALLET } from './schema';

import type { RealmWallet } from './schema';
import type { RealmSettings } from '../settings';
import type Realm from 'realm';


export const useRealmWallets = (showAllWallets = false, accountNumber?: number) => {
  const currentAccountNumber = useCurrentAccountNumber();

  return useQuery<RealmWallet>(
    REALM_TYPE_WALLET,
    wallets => {
      const targetAccountNumber = accountNumber ?? currentAccountNumber;
      const targetWallets = showAllWallets ? wallets : wallets.filtered(`accountIdx = ${targetAccountNumber}`);

      if (isNewNetworksEnabled()) {
        return targetWallets;
      }

      return targetWallets.filtered(`NOT caipId IN $0`, NEW_NETWORKS);
    },
    [accountNumber, currentAccountNumber, showAllWallets],
  );
};


export const getWalletsForMutations = (realm: Realm, showAllWallets = false) => {
  const wallets = isNewNetworksEnabled()
    ? realm.objects<RealmWallet>(REALM_TYPE_WALLET)
    : realm.objects<RealmWallet>(REALM_TYPE_WALLET).filtered(`NOT caipId IN $0`, NEW_NETWORKS);
  if (showAllWallets) {
    return wallets;
  }

  const currentAccountNumber = realm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, RealmSettingsKey.accountNumber);

  return wallets.filtered(`accountIdx = ${currentAccountNumber?.value}`);
};
