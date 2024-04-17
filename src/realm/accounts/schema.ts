import { ObjectSchema } from 'realm';

import { REALM_TYPE_WALLET, RealmWallet } from '../wallets';

export const REALM_TYPE_ACCOUNT = 'Account';
export const AccountSchema: ObjectSchema = {
  name: REALM_TYPE_ACCOUNT,
  properties: {
    accountNumber: 'int',
    accountCustomName: 'string',
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
  balance: number;
  didLoadOnce?: boolean;
};

export type RealmAccount = RealmTypeOf<Account, { wallets: Realm.List<RealmWallet> }>;
