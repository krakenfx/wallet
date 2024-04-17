import { ObjectSchema } from 'realm';

import { REALM_TYPE_NFT_METADATA, RealmNftMetadata } from '../nftMetadata';
import { REALM_TYPE_WALLET, RealmWallet } from '../wallets';

type NftTrait = {
  traitType: string;
  value: string;
  displayType?: string;
  maxValue?: string;
  traitCount?: number;
  order?: string;
};

export const REALM_TYPE_NFT_TRAIT = 'NftTrait';
export const NftTraitsSchema: ObjectSchema = {
  name: REALM_TYPE_NFT_TRAIT,
  embedded: true,
  properties: {
    traitType: 'string',
    value: 'string',
    displayType: 'string?',
    maxValue: 'string?',
    traitCount: 'int?',
    order: 'string?',
  },
};

export type Nft = {
  assetId: string;
  traits: NftTrait[];
  walletId: string;
  inGallery?: boolean;
  isArchived?: boolean;
  archivedAt?: Date;
};

export type RealmNft = RealmTypeOf<
  Nft,
  {
    wallet: RealmWallet;
    metadata: RealmNftMetadata;
  }
>;

export type RealmNftTrait = RealmTypeOf<NftTrait>;

export type NftsCollection = {
  id: string;
  name: string;
  imageUrl?: string | null;
  nfts: RealmNft[] | RealmResults<RealmNft>;
  walletId: string;
};

export const REALM_TYPE_NFT = 'NFT';
export const NftSchema: ObjectSchema = {
  name: REALM_TYPE_NFT,
  properties: {
    assetId: 'string',
    inGallery: 'bool?',
    isArchived: 'bool?',
    archivedAt: 'date?',
    traits: {
      type: 'list',
      objectType: REALM_TYPE_NFT_TRAIT,
    },
    walletId: 'string',
    wallet: {
      type: 'object',
      objectType: REALM_TYPE_WALLET,
    },
    metadata: {
      type: 'object',
      objectType: REALM_TYPE_NFT_METADATA,
    },
  },
  primaryKey: 'assetId',
};
