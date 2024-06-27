import { useCallback } from 'react';

import { isNetworkCoin } from '@/onChain/wallets/registry';

import { useFilterInBlacklistedAssets } from '../settings';

import { RealmToken } from '../tokens';

const isTokenRelevant = (token: RealmToken, filterInBlacklistedAssets?: boolean) => {
  if (!isNetworkCoin(token.assetId) && (token.metadata.reputation?.blacklists ?? []).length > 0 && (!token.inGallery || !filterInBlacklistedAssets)) {
    return false;
  }
  return true;
};

export const useIsTokenRelevant = () => {
  const filterInBlacklistedAssets = useFilterInBlacklistedAssets();

  return useCallback((token: RealmToken) => isTokenRelevant(token, filterInBlacklistedAssets), [filterInBlacklistedAssets]);
};
