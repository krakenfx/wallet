import { useMemo } from 'react';

import type { NETWORK_FILTER } from '@/components/NetworkFilter/types';
import { useFilterInBlacklistedAssets } from '@/realm/settings/useFilterInBlacklistedAssets';
import { useFilterInUnverifiedAssets } from '@/realm/settings/useFilterInUnverifiedAssets';
import { useTokens } from '@/realm/tokens';

export const useTokensFilteredByReputationAndNetwork = (networkFilter: NETWORK_FILTER[], forceFilterOutBlacklisted?: boolean) => {
  const unfilteredTokensFromRealm = useTokens();

  const filterInBlacklistedAssets = useFilterInBlacklistedAssets() && !forceFilterOutBlacklisted;
  const filterInUnverifiedAssets = useFilterInUnverifiedAssets();
  const shouldFilterOutByReputation = useMemo(
    () => !filterInBlacklistedAssets || !filterInUnverifiedAssets,
    [filterInBlacklistedAssets, filterInUnverifiedAssets],
  );

  return useMemo(() => {
    let filteredTokens = unfilteredTokensFromRealm;

    filteredTokens = networkFilter.length ? filteredTokens.filtered('assetId BEGINSWITH[c] ANY $0', networkFilter) : filteredTokens;

    if (shouldFilterOutByReputation) {
      const assetIdsFilteredOutByReputation: string[] = [];

      filteredTokens.forEach(token => {
        const tokenAssetMetadata = token.metadata;

        if (token.assetId === token.wallet.nativeTokenCaipId) {
          return;
        }

        if (!filterInBlacklistedAssets) {
          const isBlacklisted = (tokenAssetMetadata?.reputation?.blacklists || []).length > 0;

          if (isBlacklisted) {
            assetIdsFilteredOutByReputation.push(token.assetId);
            return;
          }
        }

        if (!filterInUnverifiedAssets) {
          const isUnverified =
            (tokenAssetMetadata?.reputation?.blacklists || []).length === 0 && (tokenAssetMetadata?.reputation?.whitelists || []).length === 0;
          if (isUnverified) {
            assetIdsFilteredOutByReputation.push(token.assetId);
            return;
          }
        }
      });

      if (assetIdsFilteredOutByReputation.length > 0) {
        filteredTokens = filteredTokens.filtered('! assetId IN $0', assetIdsFilteredOutByReputation);
      }
    }
    return filteredTokens;
  }, [unfilteredTokensFromRealm, networkFilter, shouldFilterOutByReputation, filterInBlacklistedAssets, filterInUnverifiedAssets]);
};
