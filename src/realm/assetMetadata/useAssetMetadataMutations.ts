import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_ASSET_METADATA } from './schema';

import type { AssetMetadata } from './schema';

export const useAssetMetadataMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const setAssetItemMetadata = useCallback(
    (assetMetadata: Partial<AssetMetadata>) => {
      runInTransaction(() => {
        realm.create<AssetMetadata>(REALM_TYPE_ASSET_METADATA, assetMetadata, Realm.UpdateMode.Modified);
      });
    },
    [realm, runInTransaction],
  );

  return {
    setAssetItemMetadata,
  };
};
