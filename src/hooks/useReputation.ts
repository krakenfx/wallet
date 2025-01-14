import type { AssetMetadata, AssetReputation } from '@/realm/assetMetadata';
import { getAssetMetadata, useAssetMetadata } from '@/realm/assetMetadata';

import type Realm from 'realm';

export enum REPUTATION {
  WHITELISTED = 'whitelisted',
  BLACKLISTED = 'blacklisted',
  UNVERIFIED = 'unverified',
}

export const emptyReputation: AssetReputation = {
  whitelists: [],
  blacklists: [],
};

export const getReputation = (reputation?: AssetReputation | null): REPUTATION => {
  if (!reputation) {
    return REPUTATION.UNVERIFIED;
  }
  const isBlacklisted = (reputation?.blacklists ?? []).length > 0;
  const isWhitelisted = (reputation?.whitelists ?? []).length > 0;

  return isBlacklisted ? REPUTATION.BLACKLISTED : isWhitelisted ? REPUTATION.WHITELISTED : REPUTATION.UNVERIFIED;
};

export const getReputationFromMetadata = (assetMetadata?: AssetMetadata | null): REPUTATION => {
  return getReputation(assetMetadata?.reputation);
};

export function useReputation(assetId: string): REPUTATION {
  const assetMetadata = useAssetMetadata({ assetId });
  return getReputationFromMetadata(assetMetadata);
}

export function useReputationLists(assetId: string): AssetReputation {
  const assetMetadata = useAssetMetadata({ assetId });

  return assetMetadata?.reputation ? assetMetadata.reputation : emptyReputation;
}

export function getAssetReputation(realm: Realm, assetId: string): REPUTATION {
  const assetMetadata = getAssetMetadata(realm, assetId);
  return getReputationFromMetadata(assetMetadata);
}
