import { useCallback } from 'react';
import Realm from 'realm';

import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { AssetMetadata, REALM_TYPE_ASSET_METADATA, RealmAssetMetadata } from './schema';

export const useAssetMetadataMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const setAssetItemMetadata = useCallback(
    (assetMetadata: Partial<AssetMetadata>) => {
      runInTransaction(() => {
        realm.create<RealmAssetMetadata>(REALM_TYPE_ASSET_METADATA, { ...assetMetadata, updateRequired: false }, Realm.UpdateMode.Modified);
      });
    },
    [realm, runInTransaction],
  );

  return {
    setAssetItemMetadata,
  };
};
