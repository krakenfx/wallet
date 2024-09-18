import { NftMetadata } from '@/realm/nftMetadata/schema';

interface Labels {
  primaryLabel: string;
  secondaryLabel: string;
}



export const getLabelsFromNft = (nft?: { metadata?: Pick<NftMetadata, 'name' | 'collectionName'> }): Labels => {
  if (nft?.metadata?.name) {
    return {
      primaryLabel: nft.metadata.name,
      secondaryLabel: nft.metadata.collectionName || '',
    };
  }

  return {
    primaryLabel: nft?.metadata?.collectionName || '',
    secondaryLabel: '',
  };
};
