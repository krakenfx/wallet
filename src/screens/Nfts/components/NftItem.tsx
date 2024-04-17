import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { Touchable, TouchableProps } from '@/components/Touchable';
import { RealmNft } from '@/realm/nfts';
import { NavigationProps, Routes } from '@/Routes';
import { getLabelsFromNft } from '@/screens/Nfts/utils';

import { ArchiveBadge } from '../components/ArchiveBadge';

const windowWidth = Dimensions.get('window').width;

export const NFT_SIZE = Math.floor(windowWidth / 2) - 28;

interface Props extends Omit<TouchableProps, 'onPress'> {
  nft: RealmNft;
  navigation: NavigationProps<'Nfts' | 'NftCollection' | 'Home'>['navigation'];
  marginBottom?: number;
}

export const NftItem = React.memo(({ nft, navigation, marginBottom, ...touchableProps }: Props) => {
  const { imageUrl, contentType } = nft.metadata;
  const nftPressed = () => {
    navigation.navigate(Routes.ViewNft, { assetId: nft.assetId });
  };
  const { primaryLabel, secondaryLabel } = getLabelsFromNft(nft);

  return (
    <Touchable onPress={nftPressed} style={[styles.wrapper, { marginBottom: marginBottom }]} testID={'NFT-' + nft.assetId} {...touchableProps}>
      <View style={styles.imageWrapper}>
        <ImageSvg fallbackIconSize={45} uri={imageUrl} width={NFT_SIZE} height={NFT_SIZE} contentType={contentType} />
      </View>
      {nft.archivedAt && <ArchiveBadge archiveDate={nft.archivedAt} style={styles.archivedBadge} />}
      {primaryLabel && (
        <Label type="boldTitle2" numberOfLines={1} style={styles.label}>
          {primaryLabel}
        </Label>
      )}
      {secondaryLabel && (
        <Label type="boldCaption1" numberOfLines={1} color="light50">
          {secondaryLabel}
        </Label>
      )}
    </Touchable>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 4,
    width: NFT_SIZE,
  },
  imageWrapper: {
    overflow: 'hidden',
    width: NFT_SIZE,
    height: NFT_SIZE,
    borderRadius: 45,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  archivedBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: 8,
  },
});
