import { useCallback } from 'react';
import Realm from 'realm';

import { NftWithRawMetadata } from '@/api/fetchNfts';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { useRealm } from '@/realm/RealmContext';

import { RealmWallet } from '../wallets';

import { NftMetadata, REALM_TYPE_NFT_METADATA, RealmNftMetadata } from './schema';

import loc from '/loc';

const ENS_CONTRACT = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'.toLowerCase();
const ENS_NAME_WRAPPER_CONTRACT = '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401'.toLowerCase();

export const useNftMetadataMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const buildNftMetadata = useCallback(({ metadata: data, token }: Omit<NftWithRawMetadata, 'metadataType'>, wallet: RealmWallet): NftMetadata => {
    const isENS = [ENS_CONTRACT, ENS_NAME_WRAPPER_CONTRACT].includes((data.collection?.id ?? '').toLowerCase());
    const tokenId = wallet.caipId === ChainAgnostic.NETWORK_SOLANA ? token.split(':').reverse()[0] : token.split('/').reverse()[0];

    return {
      assetId: token ?? '',
      name: data?.name || loc.nftView.noName,
      description: data?.description ?? '',
      contentType: data?.contentType ?? null,
      collectionId: data.collection?.id ?? '',
      collectionName: data.collection?.name || data.collection?.symbol || (isENS ? 'ENS' : ''),
      collectionImageUrl: (data.collection?.imageUrl || data?.contentUrl) ?? null,
      imageUrl: data?.contentUrl ?? '',
      tokenId,
      isENS,
      isSpam: data.isSpam ?? null,
    };
  }, []);

  const setNftsAssetMetadata = useCallback(
    (record: Omit<NftWithRawMetadata, 'metadataType'>, wallet: RealmWallet) => {
      runInTransaction(() => {
        const metadata = buildNftMetadata(record, wallet);
        realm.create<RealmNftMetadata>(REALM_TYPE_NFT_METADATA, metadata, Realm.UpdateMode.Modified);
      });
    },
    [buildNftMetadata, realm, runInTransaction],
  );

  return {
    buildNftMetadata,
    setNftsAssetMetadata,
  };
};
