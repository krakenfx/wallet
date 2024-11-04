import { REALM_TYPE_WALLET } from '../wallets';

import type { RealmWallet } from '../wallets';
import type { ObjectSchema } from 'realm';

export const REALM_TYPE_ACCOUNT = 'Account';
export const AccountSchema: ObjectSchema = {
  name: REALM_TYPE_ACCOUNT,
  properties: {
    accountNumber: 'int',
    accountCustomName: 'string',
    avatar: 'string?',
    balance: 'double',
    didLoadOnce: 'bool?',
    wallets: {
      type: 'list',
      objectType: REALM_TYPE_WALLET,
    },
  },
  primaryKey: 'accountNumber',
};
export type Account = {
  accountNumber: number;
  accountCustomName: string;
  avatar: string | null;
  balance: number;
  didLoadOnce?: boolean;
};

export type RealmAccount = RealmTypeOf<Account, { wallets: Realm.List<RealmWallet> }>;
