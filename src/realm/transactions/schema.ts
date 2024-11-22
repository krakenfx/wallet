import { REALM_TYPE_TRANSACTION_NOTES } from '../transactionNotes';

import { REALM_TYPE_WALLET } from '../wallets';

import type { RealmTransactionNotes } from '../transactionNotes';
import type { RealmWallet } from '../wallets';

import type { ObjectSchema } from 'realm';

export interface Transaction {
  id: string;
  transactionId: string;
  walletId: string;
  data: string;
  assetIds: string[];
  time: number;
  fee?: string;
  value?: string;
}
export type RealmTransaction = RealmTypeOf<
  Transaction,
  {
    wallet: RealmWallet;
    notes?: RealmTransactionNotes;
  }
>;

export const REALM_TYPE_WALLET_TRANSACTION = 'WalletTransaction';
export const WalletTransactionsSchema: ObjectSchema = {
  name: REALM_TYPE_WALLET_TRANSACTION,
  properties: {
    id: 'string',
    transactionId: 'string',
    walletId: 'string',

    data: 'string',
    assetIds: 'string[]',

    time: 'int',
    fee: 'string?',
    value: 'string?',
    wallet: {
      type: 'object',
      objectType: REALM_TYPE_WALLET,
    },
    notes: {
      type: 'object',
      objectType: REALM_TYPE_TRANSACTION_NOTES,
      optional: true,
    },
  },
  primaryKey: 'id',
};

export type PendingTransaction = {
  id: string;
  transactionId: string;
  walletId: string;
  tokenId?: string;
  amount?: string;
  fee?: string;
  kind: 'send' | 'receive';
  type: 'coin' | 'token' | 'nft';
  from?: string;
  to?: string;
  time?: number;
  confirmed?: boolean;
  additionalStatus?: 'invalidated';
};

export type RealmPendingTransaction = RealmTypeOf<
  PendingTransaction,
  {
    wallet: RealmWallet;
    notes?: RealmTransactionNotes;
  }
>;

export const REALM_TYPE_PENDING_TRANSACTION = 'PendingTransaction';
export const PendingTransactionsSchema: ObjectSchema = {
  name: REALM_TYPE_PENDING_TRANSACTION,
  properties: {
    id: 'string',
    transactionId: 'string',
    walletId: 'string',
    wallet: {
      type: 'object',
      objectType: REALM_TYPE_WALLET,
    },
    notes: {
      type: 'object',
      objectType: REALM_TYPE_TRANSACTION_NOTES,
      optional: true,
    },
    tokenId: 'string?',
    amount: 'string?',
    fee: 'string?',
    kind: 'string',
    type: 'string',
    from: 'string?',
    to: 'string?',
    time: 'int?',
    confirmed: 'bool?',
    additionalStatus: 'string?',
  },
  primaryKey: 'id',
};
