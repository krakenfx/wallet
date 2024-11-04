import type { TokenType } from '@/api/types';
import type { RemoteAsset } from '@/types';
import { adaptTokenLikeToRemoteAsset } from '@/utils/adaptTokenLikeToRemoteAsset';

export function adaptTokenTypeToRemoteAsset(assetId: string, { name, symbol, address, decimals }: TokenType, tokenList: string): RemoteAsset {
  return adaptTokenLikeToRemoteAsset({
    assetId,
    name,
    symbol,
    address,
    decimals,
    whitelists: [tokenList],
  });
}
