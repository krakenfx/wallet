import type { RemoteAsset } from '@/types';

import { adaptTokenLikeToRemoteAsset } from '@/utils/adaptTokenLikeToRemoteAsset';

import type { TokenFromTokenLists } from '../types';

export function adaptTokenFromTokenListsToRemoteAsset({ caipId, name, symbol, contract_address, decimals }: TokenFromTokenLists): RemoteAsset {
  return adaptTokenLikeToRemoteAsset({
    assetId: caipId,
    name,
    symbol,
    address: contract_address,
    decimals,
  });
}
