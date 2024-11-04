import { useCallback } from 'react';
import Realm from 'realm';

import type { RawNftData } from '@/api/fetchNfts';

import { useRealmTransaction } from '../hooks/useRealmTransaction';

import { REALM_TYPE_NFT_METADATA, useNftMetadataMutations } from '../nftMetadata';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_NFT } from './schema';

import type { Nft, RealmNft } from './schema';
import type { NftMetadata, RealmNftMetadata } from '../nftMetadata';
import type { RealmWallet } from '../wallets';

export interface NftToSave extends Omit<Nft, 'walletId'> {
  metadata: NftMetadata;
}

export const useNftsMutations = () => {
  const realm = useRealm();
  const { buildNftMetadata } = useNftMetadataMutations();
  const { runInTransaction } = useRealmTransaction();

  const saveNftsToRealm = useCallback(
    (nfts: RawNftData[], wallet: RealmWallet) => {
      console.log('[saveNftsToRealm] ' + nfts.length + ' walletId ', wallet.id);
      const existingNfts = realm.objects<RealmNft>(REALM_TYPE_NFT).filtered('wallet.id = $0', wallet.id);
      if (!wallet) {
        console.log('failed to fetch wallet');
        return;
      }
      const existingIds = new Set(existingNfts.map(nft => nft.assetId));
      const latestIds = nfts.map(nft => nft.token);
      runInTransaction(() => {
        realm.delete(existingNfts.filtered('NOT assetId IN $0', latestIds));
        
        const newData = nfts.filter(nft => !existingIds.has(nft.token) || nft.metadataType === 'raw');
        for (const data of newData) {
          const existingNft = realm.objectForPrimaryKey<RealmNft>(REALM_TYPE_NFT, data.token);

          
          const shouldNotAutoArchive = !!existingNft && (existingNft.inGallery || existingNft.archivedAt || existingNft.metadata.isSpam);

          const archive =
            !shouldNotAutoArchive && data.metadata.isSpam
              ? {
                  archivedAt: new Date(),
                  isArchived: true,
                }
              : undefined;

          const traits =
            data.metadataType === 'raw'
              ? {
                  traits:
                    data.metadata.traits?.map(({ name, value }) => ({
                      traitType: name,
                      value: value?.toString() ?? '',
                    })) ?? [],
                }
              : undefined;

          const nftObject = {
            assetId: data.token,
            ...traits,
            ...archive,
          };
          const metadata =
            data.metadataType === 'cached'
              ? data.metadata
              : realm.create<RealmNftMetadata>(REALM_TYPE_NFT_METADATA, buildNftMetadata(data, wallet), Realm.UpdateMode.Modified);

          realm.create<RealmNft>(
            REALM_TYPE_NFT,
            {
              ...nftObject,
              metadata,
              walletId: wallet.id,
              wallet,
            },
            Realm.UpdateMode.Modified,
          );
        }
      });
    },
    [buildNftMetadata, realm, runInTransaction],
  );

  const archiveNft = useCallback(
    (nft: RealmNft) => {
      realm.write(() => {
        nft.isArchived = true;
        nft.archivedAt = new Date();
        if (nft.inGallery) {
          nft.inGallery = false;
        }
      });
    },
    [realm],
  );

  const unArchiveNft = useCallback(
    (nft: RealmNft) => {
      realm.write(() => {
        nft.isArchived = false;
        nft.archivedAt = null;
      });
    },
    [realm],
  );

  const addToNftGallery = useCallback(
    (nft: RealmNft) => {
      realm.write(() => {
        nft.inGallery = true;
        if (nft.isArchived) {
          nft.isArchived = false;
          nft.archivedAt = null;
        }
      });
    },
    [realm],
  );

  const removeFromNftGallery = useCallback(
    (nft: RealmNft) => {
      realm.write(() => {
        nft.inGallery = false;
      });
    },
    [realm],
  );

  const toggleNftInGallery = useCallback(
    (nft: RealmNft) => {
      if (nft.inGallery) {
        removeFromNftGallery(nft);
      } else {
        addToNftGallery(nft);
      }
    },
    [addToNftGallery, removeFromNftGallery],
  );

  const toggleNftInArchive = useCallback(
    (nft: RealmNft) => {
      if (nft.isArchived) {
        unArchiveNft(nft);
      } else {
        archiveNft(nft);
      }
    },
    [archiveNft, unArchiveNft],
  );

  return {
    saveNftsToRealm,
    archiveNft,
    unArchiveNft,
    toggleNftInArchive,
    toggleNftInGallery,
  };
};
