import { useEffect, useMemo } from 'react';

import { getHarmony } from '@/api/base/apiFactory';
import type { NFTMetadata } from '@/api/types';
import { useRealmQueue } from '@/realm/hooks/useRealmQueue';
import { useObject } from '@/realm/RealmContext';

import { useLocalCacheState } from '../hooks/useLocalCacheState';

import { REALM_TYPE_NFT_METADATA } from './schema';
import { useNftMetadataMutations } from './useNftMetadataMutations';

import type { NftMetadata, RealmNftMetadata } from './schema';
import type { RealmWallet } from '../wallets';
import type Realm from 'realm';

import { createErrorHandlerWithContext } from '/helpers/errorHandler';

interface Props {
  assetId: string;
  wallet: RealmWallet;
  realmQueueName?: string;
}

const CACHE_KEY = 'nftMetadata';

export const useNftMetadata = ({ assetId, wallet, realmQueueName }: Props): NftMetadata | undefined => {
  const tokenItem = useObject<RealmNftMetadata, string | undefined>(REALM_TYPE_NFT_METADATA, assetId, 'assetId');
  const { setNftsAssetMetadata, buildNftMetadata } = useNftMetadataMutations();
  const { setShouldUseCache } = useLocalCacheState(assetId);

  const { addToRealmTransactionQueue, getFromLocalCache, saveInLocalCache } = useRealmQueue();
  const localCacheValue = assetId && realmQueueName ? getFromLocalCache<NftMetadata>(realmQueueName, CACHE_KEY, assetId) : undefined;

  useEffect(() => {
    const fetchAndSetNftMetadata = async () => {
      const harmony = await getHarmony();
      const response = await harmony.GET('/v1/tokenMetadata', { params: { query: { token: assetId } } });
      const metadata: NFTMetadata | undefined = response.content && 'isNFT' in response.content && response.content.isNFT ? response.content : undefined;
      if (metadata) {
        if (realmQueueName) {
          saveInLocalCache<NftMetadata>(realmQueueName, CACHE_KEY, assetId, buildNftMetadata({ metadata, token: assetId }, wallet));
          setShouldUseCache(true);
          addToRealmTransactionQueue(realmQueueName, () => setNftsAssetMetadata({ metadata, token: assetId }, wallet));
        } else {
          setNftsAssetMetadata({ metadata, token: assetId }, wallet);
        }
      }
    };
    if (!tokenItem && !localCacheValue) {
      fetchAndSetNftMetadata().catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));
    }
  }, [
    setNftsAssetMetadata,
    tokenItem,
    assetId,
    wallet,
    buildNftMetadata,
    realmQueueName,
    addToRealmTransactionQueue,
    saveInLocalCache,
    localCacheValue,
    setShouldUseCache,
  ]);

  return useMemo(() => localCacheValue ?? tokenItem, [localCacheValue, tokenItem]);
};

export const getNftMetadata = (realm: Realm, assetId: string) => {
  return realm.objectForPrimaryKey<RealmNftMetadata>(REALM_TYPE_NFT_METADATA, assetId);
};
