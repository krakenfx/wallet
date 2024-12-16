import type React from 'react';

import { createRealmContext } from '@realm/react';

import { realmConfig } from './realmSchema';

import type Realm from 'realm';

const { RealmProvider: ReactRealmProvider, useRealm: useUnencryptedRealm, useQuery: useUnencryptedQuery } = createRealmContext(realmConfig);

interface Props {
  children: React.ReactNode;
}

export const UnencryptedRealmProvider = ({ children }: Props) => {
  return <ReactRealmProvider>{children}</ReactRealmProvider>;
};

function useUnencryptedObject<T, K = string>(
  type: string,
  primaryKey: K | undefined,
  primaryKeyName: Extract<keyof T, string>,
): K extends undefined ? (T & Realm.Object<T>) | undefined : T & Realm.Object<T> {
  return useUnencryptedQuery<T>(type, o => o.filtered(`${primaryKeyName} = '${primaryKey}'`), [type, primaryKey, primaryKeyName])?.[0];
}

export { useUnencryptedRealm, useUnencryptedObject, useUnencryptedQuery };
