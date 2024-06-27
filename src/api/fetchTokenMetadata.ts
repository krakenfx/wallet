import { getHarmony } from '@/api/base/apiFactory';
import { TokenMetadata } from '@/api/types';
import { AssetMetadata } from '@/realm/assetMetadata';

import { adaptTokenReputationToRealmAssetReputation } from '../utils/adaptTokenReputationToRealmAssetReputation';

export async function fetchTokenMetadata(assetId: string): Promise<AssetMetadata> {
  const harmony = await getHarmony();
  const response = await harmony.GET('/v1/tokenMetadata', {
    params: { query: { token: assetId } },
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
    tokenAddress: metadata?.tokenAddress,
    subLabels: metadata?.subLabels,
    links: metadata?.links ?? [],
    description: metadata?.description,
    explorers: metadata?.explorers ?? [],
  };
}
