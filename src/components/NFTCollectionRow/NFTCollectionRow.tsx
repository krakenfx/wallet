import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import type { TouchableProps } from '@/components/Touchable';
import { Touchable } from '@/components/Touchable';
import type { NftsCollection } from '@/realm/nfts';
import { useRealmWalletById } from '@/realm/wallets';

import { OverlappingCollection } from '../OverlappingCollection';

interface CollectionRowProps extends Omit<TouchableProps, 'onPress'> {
  collection: NftsCollection;
  imageComponent?: React.ReactElement;
  onPress: (collection: NftsCollection) => void;
}

const COLLECTION_IMG_SIZE = 40;
const NFT_IMG_SIZE = 32;
const MASKED_ITEM_OFFSET = 13;

export const NFTCollectionRow = React.memo(({ imageComponent, collection, onPress, ...props }: CollectionRowProps) => {
  const walletType = useRealmWalletById(collection.walletId)?.type;

  const handlePress = useCallback(() => {
    onPress(collection);
  }, [collection, onPress]);

  const collectionName = collection.name || collection.nfts.at(0)?.metadata.name;

  const images = collection.nfts.map(nft => (
    <ImageSvg fallbackIconSize={16} width={NFT_IMG_SIZE} height={NFT_IMG_SIZE} uri={nft.metadata.imageUrl} contentType={nft.metadata.contentType} />
  ));

  return (
    <Touchable onPress={handlePress} style={styles.wrapper} testID={collection.id} {...props}>
      <View style={styles.collectionImage}>
        {imageComponent ?? (
          <MaskedElementWithCoin
            maskedElement={<ImageSvg width={COLLECTION_IMG_SIZE} height={COLLECTION_IMG_SIZE} uri={collection.imageUrl} />}
            coinType={walletType}
            size={COLLECTION_IMG_SIZE}
            coinSize={16}
          />
        )}
      </View>
      <View style={styles.label}>
        {collectionName && (
          <Label type="boldTitle2" numberOfLines={1}>
            {collectionName}
          </Label>
        )}
      </View>
      <OverlappingCollection itemSize={NFT_IMG_SIZE} maskedItemOffset={MASKED_ITEM_OFFSET} items={images} />
    </Touchable>
  );
});

export const COLLECTION_ROW_SIZE = 52;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    height: COLLECTION_ROW_SIZE,
  },
  collectionImage: {
    minWidth: 40,
    marginRight: 12,
  },
  label: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
    minHeight: 60,
  },
});
