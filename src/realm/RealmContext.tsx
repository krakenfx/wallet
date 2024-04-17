import { createRealmContext } from '@realm/react';
import React from 'react';

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
  return useQuery<T>(type).filtered(`${primaryKeyName} = '${primaryKey}'`)?.[0];
}

export { useRealm, useObject, useQuery };
