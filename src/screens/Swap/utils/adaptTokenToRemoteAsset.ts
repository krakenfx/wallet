import type { RealmToken } from '@/realm/tokens';
import { getNetworkNameFromAssetId } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';

export function adaptTokenToRemoteAsset(token: RealmToken): RemoteAsset {
  return {
    assetId: token.assetId,
    balance: token.balance,
    metadata: {
      ...token.metadata,
      reputation: {
        whitelists: token.metadata.reputation?.whitelists ?? [],
        blacklists: token.metadata.reputation?.blacklists ?? [],
      },
      walletType: getNetworkNameFromAssetId(token.assetId),
    },
    type: 'remoteAsset',
  };
}
