import type { ObjectSchema } from 'realm';

export type NftMetadata = {
  assetId: string;
  name: string;
  imageUrl: string;
  collectionId: string;
  collectionName: string;
  collectionImageUrl: string | null;
  contentType: string | null;
  description: string;
  tokenId: string;
  isENS: boolean;
  isSpam: boolean | null;
};

export type RealmNftMetadata = RealmTypeOf<NftMetadata>;

export const REALM_TYPE_NFT_METADATA = 'NftMetadata';
export const NftMetadataSchema: ObjectSchema = {
  name: REALM_TYPE_NFT_METADATA,
  properties: {
    assetId: 'string',
    name: 'string',
    imageUrl: 'string',
    collectionId: 'string',
    collectionName: 'string',
    collectionImageUrl: 'string?',
    contentType: 'string?',
    description: 'string',
    tokenId: 'string',
    isENS: 'bool',
    isSpam: 'bool?',
  },
  primaryKey: 'assetId',
};
