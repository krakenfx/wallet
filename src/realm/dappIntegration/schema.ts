import type { ObjectSchema } from 'realm';

export interface DappWalletPermissions {
  cleanUrl: string;
  accountIdxs: number[];
  date: number;
}

export const REALM_TYPE_DAPP_WALLET_PERMISSIONS = 'DappWalletPermissions';
export const DappWalletPermissionsSchema: ObjectSchema = {
  name: REALM_TYPE_DAPP_WALLET_PERMISSIONS,
  properties: {
    cleanUrl: 'string',
    accountIdxs: 'int[]',
    date: 'int',
  },
  primaryKey: 'cleanUrl',
};
