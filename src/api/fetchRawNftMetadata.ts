import { getHarmony } from '@/api/base/apiFactory';
import { fetchClient, HTTPError } from '@/api/base/fetchClient';
import type { NftWithRawMetadata, RawNftMetadata } from '@/api/fetchNfts';
import type { NFT } from '@/api/types';

import { handleError } from '/helpers/errorHandler';

export async function fetchRawNftMetadata(nft: NFT): Promise<NftWithRawMetadata> {
  const harmony = await getHarmony();

  let metadata: RawNftMetadata = {};
  try {
    const result = await harmony.GET('/v1/tokenMetadata', {
      params: { query: { token: nft.token } },
    });

    if (result.content && 'isNFT' in result.content && result.content.isNFT) {
      metadata = result.content ?? undefined;
      if (!metadata?.contentType && metadata?.contentUrl) {
        try {
          const contentTypeResult = await fetchClient(metadata?.contentUrl, { method: 'HEAD' });
          metadata.contentType = contentTypeResult.headers.get('content-type')?.toLowerCase();
        } catch (e) {
          if (!(e instanceof HTTPError)) {
            throw e;
          }
        }
      }
    }
    return {
      metadata,
      token: nft.token,
      metadataType: 'raw',
    };
  } catch (e) {
    if (e instanceof HTTPError) {
      console.error('HTTPError while fetching metadata', await e.response.text());
    }
    handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    return {
      metadata,
      token: nft.token,
      metadataType: 'raw',
    };
  }
}
