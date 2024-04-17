import { useMemo } from 'react';
import Realm from 'realm';

import { useCurrentAccountNumber } from '../accounts';
import { useQuery } from '../RealmContext';
import { REALM_TYPE_SETTINGS, RealmSettings, RealmSettingsKey } from '../settings';

import { REALM_TYPE_WALLET, RealmWallet } from './schema';

export const useRealmWallets = (showAllWallets = false, accountNumber?: number) => {
  const currentAccountNumber = useCurrentAccountNumber();

  const wallets = useQuery<RealmWallet>(REALM_TYPE_WALLET);
  return useMemo(() => {
    const targetAccountNumber = accountNumber ?? currentAccountNumber;
    return showAllWallets ? wallets : wallets.filtered(`accountIdx = ${targetAccountNumber}`);
  }, [accountNumber, currentAccountNumber, showAllWallets, wallets]);
};

export const getWalletsForMutations = (realm: Realm, showAllWallets = false) => {
  const wallets = realm.objects<RealmWallet>(REALM_TYPE_WALLET);

  if (showAllWallets) {
    return wallets;
  } else {
    const currentAccountNumber = realm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, RealmSettingsKey.accountNumber);
    return wallets.filtered(`accountIdx = ${currentAccountNumber?.value}`);
  }
};
