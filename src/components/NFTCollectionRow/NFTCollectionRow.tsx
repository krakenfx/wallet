import MaskedView from '@react-native-masked-view/masked-view';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, Defs, G, Mask, Svg } from 'react-native-svg';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import { OverlappingListWithHasMoreCount } from '@/components/OverlappingListWithHasMoreCount';
import { Touchable, TouchableProps } from '@/components/Touchable';
import { NftsCollection } from '@/realm/nfts';
import { useRealmWalletById } from '@/realm/wallets';
import { useTheme } from '@/theme/themes';

interface CollectionRowProps extends Omit<TouchableProps, 'onPress'> {
  collection: NftsCollection;
  imageComponent?: React.ReactElement;
  onPress: (collection: NftsCollection) => void;
}

const COLLECTION_IMG_SIZE = 40;
const NFT_IMG_SIZE = 32;
const NFT_IMG_RADIUS = NFT_IMG_SIZE / 2;
const ITEMS_TO_SHOW = 3;
const MASKED_ITEM_OFFSET = 13;

export const NFTCollectionRow = React.memo(({ imageComponent, collection, onPress, ...props }: CollectionRowProps) => {
  const walletType = useRealmWalletById(collection.walletId)?.type;
  const { colors } = useTheme();

  const nfts = useMemo(() => {
    const hasMore = ITEMS_TO_SHOW < collection.nfts.length;
    const nfts_ = collection.nfts
      .slice(0, ITEMS_TO_SHOW)
      .map<React.ReactNode>((nft, i) => {
        const index = i + (hasMore ? 1 : 0);
        return (
          <View key={i} style={styles.collectionIconContainer}>
            <MaskedView
              maskElement={
                <Svg>
                  <Defs>
                    <Mask id="moonShape" maskUnits="userSpaceOnUse">
                      <Circle x={NFT_IMG_RADIUS} y={NFT_IMG_RADIUS} r={NFT_IMG_RADIUS} fill="white" />
                      {index !== 0 && <Circle x={NFT_IMG_SIZE + 2} y={NFT_IMG_RADIUS} r={NFT_IMG_RADIUS + 2} fill="black" />}
                    </Mask>
                  </Defs>
                  <G mask={'url(#moonShape)'}>
                    <Circle x={NFT_IMG_RADIUS} y={NFT_IMG_RADIUS} r={NFT_IMG_RADIUS} />
                  </G>
                </Svg>
              }>
              <ImageSvg fallbackIconSize={16} width={NFT_IMG_SIZE} height={NFT_IMG_SIZE} uri={nft.metadata.imageUrl} contentType={nft.metadata.contentType} />
            </MaskedView>
          </View>
        );
      })
      .reverse();

    const hasMoreCountProps = {
      backgroundColor: colors.light15,
      circleSize: NFT_IMG_SIZE,
      fontSize: 13,
      count: collection.nfts.length - ITEMS_TO_SHOW,
    };

    return <OverlappingListWithHasMoreCount items={nfts_} offsetSize={MASKED_ITEM_OFFSET} hasMoreCount={hasMoreCountProps} />;
  }, [collection.nfts, colors.light15]);

  const handlePress = useCallback(() => {
    onPress(collection);
  }, [collection, onPress]);

  const collectionName = collection.name || collection.nfts.at(0)?.metadata.name;

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

      {nfts}
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
  collectionIconContainer: {
    overflow: 'hidden',
    width: NFT_IMG_SIZE,
    height: NFT_IMG_SIZE,
    borderRadius: NFT_IMG_RADIUS,
  },
  label: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
    minHeight: 60,
  },
});
