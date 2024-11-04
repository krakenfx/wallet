import { useObject } from '../RealmContext';

import { REALM_TYPE_WALLET } from './schema';

import type { RealmWallet } from './schema';

export const useRealmWalletById = <T extends string | undefined>(walletId: T) => {
  return useObject<RealmWallet, T>(REALM_TYPE_WALLET, walletId, 'id');
};
