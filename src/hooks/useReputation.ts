import type { AssetMetadata, AssetReputation } from '@/realm/assetMetadata';
import { getAssetMetadata, useAssetMetadata } from '@/realm/assetMetadata';

import type Realm from 'realm';

export enum REPUTATION {
  WHITELISTED = 'whitelisted',
  BLACKLISTED = 'blacklisted',
  UNVERIFIED = 'unverified',
}

export const getReputation = (assetMetadata?: AssetMetadata | null): REPUTATION => {
  if (!assetMetadata) {
    return REPUTATION.UNVERIFIED;
  }
  const isBlacklisted = (assetMetadata?.reputation?.blacklists ?? []).length > 0;
  const isWhitelisted = (assetMetadata?.reputation?.whitelists ?? []).length > 0;

  
  return isBlacklisted ? REPUTATION.BLACKLISTED : isWhitelisted ? REPUTATION.WHITELISTED : REPUTATION.UNVERIFIED;
};

export function useReputation(assetId: string): REPUTATION {
  const assetMetadata = useAssetMetadata({ assetId });
  return getReputation(assetMetadata);
}

export function useReputationLists(assetId: string): AssetReputation {
  const assetMetadata = useAssetMetadata({ assetId });

  return assetMetadata?.reputation ? assetMetadata.reputation : { whitelists: [], blacklists: [] };
}

export function getAssetReputation(realm: Realm, assetId: string): REPUTATION {
  const assetMetadata = getAssetMetadata(realm, assetId);
  return getReputation(assetMetadata);
}
