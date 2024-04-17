import { NftMetadata } from '@/realm/nftMetadata/schema';

interface Labels {
  primaryLabel: string;
  secondaryLabel: string;
}

export const getLabelsFromNft = ({ metadata: { name, collectionName } }: { metadata: Pick<NftMetadata, 'name' | 'collectionName'> }): Labels => {
  let primaryLabel = '';
  let secondaryLabel = '';

  if (name) {
    primaryLabel = name;
    secondaryLabel = collectionName;
  } else if (collectionName) {
    primaryLabel = collectionName;
    secondaryLabel = '';
  }

  return {
    primaryLabel,
    secondaryLabel,
  };
};
