import type React from 'react';

import { createRealmContext } from '@realm/react';

import { realmConfig } from './realmSchema';

const { RealmProvider: ReactRealmProvider, useRealm, useQuery } = createRealmContext(realmConfig);

interface Props {
  children: React.ReactNode | React.ReactNode[];
  encryptionKey: Int8Array;
}

export const RealmProvider = ({ children, encryptionKey }: Props) => {
  return <ReactRealmProvider encryptionKey={encryptionKey}>{children}</ReactRealmProvider>;
};

function useObject<T, K = string>(
  type: string,
  primaryKey: K | undefined,
  primaryKeyName: Extract<keyof T, string>,
): K extends undefined ? (T & Realm.Object<T>) | undefined : T & Realm.Object<T> {
  return useQuery<T>(type, o => o.filtered(`${primaryKeyName} = '${primaryKey}'`), [type, primaryKey, primaryKeyName])?.[0];
}

export { useRealm, useObject, useQuery };
