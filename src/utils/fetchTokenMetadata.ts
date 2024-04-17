import { getHarmony } from '@/api/base/apiFactory';
import { TokenMetadata } from '@/api/types';
import { AssetMetadata } from '@/realm/assetMetadata';

import { adaptTokenReputationToRealmAssetReputation } from './adaptTokenReputationToRealmAssetReputation';

import { handleError } from '/helpers/errorHandler';

export async function fetchTokenMetadata(assetId: string): Promise<AssetMetadata> {
  const harmony = await getHarmony();
  const response = await harmony
    .GET('/v1/tokenMetadata', {
      params: { query: { token: assetId } },
    })
    .catch(err => {
      handleError(err, 'ERROR_CONTEXT_PLACEHOLDER');
      return null;
    });
  const metadata: TokenMetadata | undefined = response?.content && !('isNFT' in response.content) ? response.content : undefined;

  return {
    assetId,
    logoUrl: metadata?.logoUrl ?? null,
    symbol: metadata?.symbol ?? '',
    label: metadata?.label ?? '',
    decimals: metadata?.decimals ?? 0,
    updateRequired: null,
    reputation: adaptTokenReputationToRealmAssetReputation(metadata?.reputation),
  };
}
