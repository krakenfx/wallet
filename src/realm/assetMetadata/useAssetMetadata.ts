import { useEffect, useMemo, useRef } from 'react';
import Realm from 'realm';

import { fetchTokenMetadata } from '@/api/fetchTokenMetadata';

import { useLocalCacheState } from '../hooks/useLocalCacheState';
import { useRealmQueue } from '../hooks/useRealmQueue';
import { useObject } from '../RealmContext';

import { AssetMetadata, REALM_TYPE_ASSET_METADATA, RealmAssetMetadata } from './schema';
import { useAssetMetadataMutations } from './useAssetMetadataMutations';

import { createErrorHandlerWithContext } from '/helpers/errorHandler';

interface Props {
  assetId: string;
  realmQueueName?: string;
  refresh?: boolean;
}

const CACHE_KEY = 'assetMetadata';

export const useAssetMetadata = ({ assetId, realmQueueName, refresh }: Props): AssetMetadata | undefined => {
  const currentMetadata = useObject<RealmAssetMetadata, string | undefined>(REALM_TYPE_ASSET_METADATA, assetId, 'assetId');
  const { setAssetItemMetadata } = useAssetMetadataMutations();
  const { setShouldUseCache } = useLocalCacheState(assetId);
  const { addToRealmTransactionQueue, saveInLocalCache, getFromLocalCache } = useRealmQueue();
  const localCacheValue = assetId && realmQueueName ? getFromLocalCache<AssetMetadata>(realmQueueName, CACHE_KEY, assetId) : undefined;
  const didFetch = useRef<boolean>();

  useEffect(() => {
    const fetchAndSetAssetMetadata = async () => {
      const tokenMetadata = await fetchTokenMetadata(assetId!);
      if (tokenMetadata) {
        if (realmQueueName) {
          saveInLocalCache<AssetMetadata>(realmQueueName, CACHE_KEY, assetId, tokenMetadata);
          setShouldUseCache(!refresh);
          addToRealmTransactionQueue(realmQueueName, () => setAssetItemMetadata(tokenMetadata));
        } else {
          setAssetItemMetadata(tokenMetadata);
        }
      }
    };
    if ((assetId && (!currentMetadata || currentMetadata?.updateRequired) && !localCacheValue) || (refresh && !didFetch.current)) {
      didFetch.current = true;
      fetchAndSetAssetMetadata().catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));
    }
  }, [
    setAssetItemMetadata,
    currentMetadata,
    assetId,
    addToRealmTransactionQueue,
    realmQueueName,
    saveInLocalCache,
    localCacheValue,
    setShouldUseCache,
    refresh,
  ]);

  return useMemo(() => localCacheValue ?? currentMetadata, [currentMetadata, localCacheValue]);
};

export const getAssetMetadata = (realm: Realm, assetId: string) => {
  return realm.objectForPrimaryKey<RealmAssetMetadata>(REALM_TYPE_ASSET_METADATA, assetId);
};
