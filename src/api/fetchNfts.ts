import { chunk } from 'lodash';

import { RealmishWallet } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { RealmNftMetadata } from '@/realm/nftMetadata';
import { isPromiseFulfilled } from '@/utils/promise';

import { APIResponseError, getHarmony } from './base/apiFactory';
import { NFT, NFTMetadata } from './types';

export type RawNftMetadata = Omit<NFTMetadata, 'isNFT'>;
export type NftWithRawMetadata = NFT & {
  metadata: RawNftMetadata;
  metadataType: 'raw';
};
export type NftWithCachedMetadata = NFT & {
  metadata: RealmNftMetadata;
  metadataType: 'cached';
};

export type RawNftData = NftWithRawMetadata | NftWithCachedMetadata;

export const fetchNfts = async (wallet: RealmishWallet, getRawNftMetadata: (nft: NFT) => Promise<RawNftData>): Promise<RawNftData[]> => {
  const { network } = getImplForWallet(wallet);
  if (!network.deriveAddress || !network.createNFTTransferTransaction) {
    return [];
  }
  const address = await network.deriveAddress(wallet);
  try {
    return await fetchFromHarmony(address, network.caipId, getRawNftMetadata);
  } catch (e) {
    if (e instanceof APIResponseError) {
      
      
      
      const params = e.errorContent?.params as unknown as { [key: string]: unknown };
      if (typeof params === 'object' && typeof params._ === 'string') {
        const firstMessage = params._ as string;
        if (firstMessage.includes('data type is not supported')) {
          return [];
        }
      }
    }
    console.log(`failed to fetch NFTs for ${address} on ${network.caipId}`);
    throw e;
  }
};

export async function fetchFromHarmony(address: string, network: string, getRawNftMetadata: (nft: NFT) => Promise<RawNftData>): Promise<RawNftData[]> {
  const harmony = await getHarmony();

  const result = await harmony.GET('/v1/nfts', {
    params: {
      query: {
        address: address,
        network: network,
      },
    },
  });

  const nfts: RawNftData[] = [];
  const allowedConcurrentRequests = 20;
  
  const chunks = chunk(result.content, allowedConcurrentRequests);
  for (const ch of chunks) {
    const batchResult = await Promise.allSettled(ch.map(nft => getRawNftMetadata(nft)));
    nfts.push(...batchResult.filter(isPromiseFulfilled).map(({ value }) => value));
  }
  return nfts;
}
