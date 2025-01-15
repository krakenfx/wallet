import { useTokenListReputationLookupQuery } from '@/reactQuery/hooks/useTokenListsQuery';

import type { AssetReputation } from '@/realm/assetMetadata';

import { emptyReputation } from './useReputation';

export const useTokenListReputation = (assetId: string): AssetReputation => {
  const { data } = useTokenListReputationLookupQuery();

  if (!data) {
    return emptyReputation;
  }
  return data[assetId] ?? emptyReputation;
};
