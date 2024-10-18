import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { cancelActiveRequestsAndInvalidateCache } from '@/api/base/fetchClient';
import { hideToast } from '@/components/Toast';
import { Routes } from '@/Routes';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { REALM_TYPE_ACCOUNT, RealmAccount } from '../accounts';
import { REALM_TYPE_ASSET_MARKET_DATA } from '../assetMarketData';
import { REALM_TYPE_ASSET_METADATA } from '../assetMetadata';
import { REALM_TYPE_DEFI } from '../defi';
import { useRealmQueue } from '../hooks/useRealmQueue';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { REALM_TYPE_NFT_METADATA } from '../nftMetadata';
import { REALM_TYPE_NFT } from '../nfts';
import { refreshingAllEvent, useRefreshStateActions } from '../refreshManagerHooks';
import { REALM_TYPE_TOKEN_PRICE } from '../tokenPrice';
import { REALM_TYPE_TOKEN, RealmToken } from '../tokens';
import { REALM_TYPE_PENDING_TRANSACTION, REALM_TYPE_WALLET_TRANSACTION } from '../transactions';

export const useClearAppCache = () => {
  const { runInTransaction } = useRealmTransaction();
  const { refreshAll } = useRefreshStateActions();
  const navigation = useNavigation();
  const { cancelAllQueues } = useRealmQueue();

  const clearAppCache = useCallback(() => {
    cancelActiveRequestsAndInvalidateCache();
    cancelAllQueues();
    hideToast({ id: refreshingAllEvent });
    runAfterUISync(() => {
      runInTransaction(realm => {
        const dataToDelete = [
          REALM_TYPE_WALLET_TRANSACTION,
          REALM_TYPE_PENDING_TRANSACTION,
          REALM_TYPE_DEFI,
          REALM_TYPE_NFT,
          REALM_TYPE_NFT_METADATA,
          REALM_TYPE_ASSET_MARKET_DATA,
          REALM_TYPE_TOKEN_PRICE,
        ];

        dataToDelete.forEach(dataType => {
          realm.delete(realm.objects(dataType));
        });

        const nativeTokens = realm.objects<RealmToken>(REALM_TYPE_TOKEN).filtered('assetId == wallet.nativeTokenCaipId');
        const nativeTokenIds = nativeTokens.map(t => t.assetId);
        realm.delete(realm.objects(REALM_TYPE_TOKEN).filtered('NOT assetId IN $0', nativeTokenIds));
        realm.delete(realm.objects(REALM_TYPE_ASSET_METADATA).filtered('NOT assetId IN $0', nativeTokenIds));
        realm.objects<RealmAccount>(REALM_TYPE_ACCOUNT).forEach(account => {
          account.didLoadOnce = false;
        });
      });
      navigation.reset({ index: 0, routes: [{ name: Routes.Home }] });
      refreshAll();
    });
  }, [cancelAllQueues, navigation, refreshAll, runInTransaction]);

  return {
    clearAppCache,
  };
};
