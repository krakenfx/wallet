import { ObjectSchema } from 'realm';

export type TransactionNotes = {
  id: string;
  value: string;
};

export type RealmTransactionNotes = RealmTypeOf<TransactionNotes>;

export const REALM_TYPE_TRANSACTION_NOTES = 'TransactionNotes';
export const TransactionNotesSchema: ObjectSchema = {
  name: REALM_TYPE_TRANSACTION_NOTES,
  properties: {
    id: 'string',
    value: 'string',
  },
  primaryKey: 'id',
};
