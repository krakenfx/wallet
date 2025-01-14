import type { TokenType } from '@/api/types';
import type { AssetReputation } from '@/realm/assetMetadata';
import type { RemoteAsset } from '@/types';
import { adaptTokenLikeToRemoteAsset } from '@/utils/adaptTokenLikeToRemoteAsset';

export function adaptTokenTypeToRemoteAsset(assetId: string, { name, symbol, address, decimals }: TokenType, reputation?: AssetReputation): RemoteAsset {
  return adaptTokenLikeToRemoteAsset({
    assetId,
    name,
    symbol,
    address,
    decimals,
    whitelists: reputation?.whitelists,
    blacklists: reputation?.blacklists,
  });
}
