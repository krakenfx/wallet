import { useQuery } from '@tanstack/react-query';

import { fetchTokenLists } from '@/api/fetchTokenLists';
import type { AssetReputation } from '@/realm/assetMetadata';
import { adaptTokenFromTokenListsToRemoteAsset } from '@/screens/CoinsList/utils/adaptTokenFromTokenListsToRemoteAsset';
import type { RemoteAsset } from '@/types';

const STALE_TIME = 30 * 3600 * 1000;
const MAX_RETRY_TIME = 60 * 1000;
export const useTokenListsQuery = () => {
  return useQuery({
    queryKey: ['tokenLists'],
    staleTime: STALE_TIME,
    gcTime: Infinity,
    retry: 5,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, MAX_RETRY_TIME),
    queryFn: () => fetchTokenLists(),
  });
};

export const useTokenListReputationLookupQuery = () => {
  const { data, isLoading, isError } = useTokenListsQuery();

  return useQuery({
    queryKey: ['tokenListReputationLookup'],
    staleTime: STALE_TIME,
    gcTime: Infinity,
    enabled: !isLoading && !isError && !!data,
    queryFn: () => {
      if (!data) {
        return {};
      }

      const lookupTable: Record<string, AssetReputation> = {};
      const { whitelist, blacklist } = data;

      whitelist.forEach(token => {
        lookupTable[token.caipId] = {
          ...lookupTable[token.caipId],
          whitelists: token.lists,
        };
      });
      blacklist.forEach(token => {
        lookupTable[token.caipId] = {
          ...lookupTable[token.caipId],
          blacklists: token.lists,
        };
      });

      return lookupTable;
    },
  });
};

export const useKrakenTokenListQuery = () => {
  const { data, isLoading, isError } = useTokenListsQuery();
  return useQuery<RemoteAsset[]>({
    queryKey: ['krakenTokenLists'],
    gcTime: Infinity,
    enabled: !isLoading && !isError && !!data,
    queryFn: () => {
      if (!data) {
        return [];
      }
      const krakenTokens = data.whitelist.filter(token => token.lists.some(provider => provider.toLowerCase() === 'kraken'));
      return krakenTokens.map(token => adaptTokenFromTokenListsToRemoteAsset(token));
    },
  });
};
