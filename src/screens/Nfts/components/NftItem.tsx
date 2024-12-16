import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { LongPressable } from '@/components/LongPress';
import type { LongPressOptionItemProps } from '@/components/LongPress/LongPressOptionItem';
import type { TouchableProps } from '@/components/Touchable';
import { Touchable } from '@/components/Touchable';
import { useBrowser } from '@/hooks/useBrowser';
import type { RealmNft } from '@/realm/nfts';
import { useNftGalleryToggle, useNftsMutations } from '@/realm/nfts';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import { getLabelsFromNft } from '@/screens/Nfts/utils';

import { ArchiveBadge } from '../components/ArchiveBadge';

import { configNftLinks } from './NFTLinks';

import loc from '/loc';

const windowWidth = Dimensions.get('window').width;

export const NFT_SIZE = Math.floor(windowWidth / 2) - 28;

interface Props extends Omit<TouchableProps, 'onPress'> {
  nft: RealmNft;
  navigation: NavigationProps<'Nfts' | 'NftCollection' | 'Home'>['navigation'];
  marginBottom?: number;
}

const BORDER_RADIUS = 45;
const BORDER_RADIUS_LONG_PRESSED = 16;

export const NftItem = React.memo(({ nft, navigation, marginBottom, ...touchableProps }: Props) => {
  const { imageUrl, contentType } = nft.metadata;
  const nftPressed = useCallback(() => {
    navigation.navigate(Routes.ViewNft, { assetId: nft.assetId });
  }, [navigation, nft.assetId]);
  const { primaryLabel, secondaryLabel } = getLabelsFromNft(nft);
  const { toggleGallery } = useNftGalleryToggle(nft);
  const { toggleNftInArchive } = useNftsMutations();
  const [isLongPressed, setIsLongPressed] = useState(false);
  const { openURL } = useBrowser();

  const longPressOptions = useMemo(
    () => {
      const explorer = configNftLinks[nft.wallet.type]?.blockchainExplorer;
      const data: (LongPressOptionItemProps | undefined | false)[] = [
        {
          text: loc.nftOptions.viewDetails,
          onPress: nftPressed,
          iconName: 'nft',
        },
        {
          text: loc.nftOptions.send,
          onPress: () => navigation.navigate(Routes.SendStack, { screen: Routes.Send, params: { nftAssetId: nft.assetId } }),
          iconName: 'send',
          spaceBelow: true,
        },
        {
          text: nft.inGallery ? loc.nftOptions.unfavorite : loc.nftOptions.favorite,
          onPress: toggleGallery,
          iconName: nft.inGallery ? 'star-filled' : 'star',
        },
        explorer && {
          text: loc.formatString(loc.nftOptions.viewOn, { explorer: explorer.label }),
          iconName: explorer.icon ?? 'placeholder-explorer',
          onPress: explorer.onPress(nft.metadata.collectionId, nft.metadata.tokenId, openURL),
          spaceBelow: true,
        },
        {
          text: nft.isArchived ? loc.nftOptions.unarchive : loc.nftOptions.archive,
          onPress: () => toggleNftInArchive(nft),
          iconName: nft.isArchived ? 'un-archive' : 'archive',
        },
      ];
      return data.filter(o => !!o);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation, nft, nftPressed, toggleGallery, toggleNftInArchive],
  );

  const onLongPressStart = () => {
    setIsLongPressed(true);
  };

  const onLongPressEnd = () => {
    setIsLongPressed(false);
  };

  const imageStyles = useAnimatedStyle(() => ({
    borderRadius: withTiming(isLongPressed ? BORDER_RADIUS_LONG_PRESSED : BORDER_RADIUS),
  }));

  return (
    <LongPressable withXPosition options={longPressOptions} onLongPressEnd={onLongPressEnd} onLongPressStart={onLongPressStart}>
      <Touchable onPress={nftPressed} style={[styles.wrapper, { marginBottom: marginBottom }]} testID={'NFT-' + nft.assetId} {...touchableProps}>
        <Animated.View style={[styles.imageWrapper, imageStyles]}>
          <ImageSvg fallbackIconSize={45} uri={imageUrl} width={NFT_SIZE} height={NFT_SIZE} contentType={contentType} />
        </Animated.View>
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
    </LongPressable>
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
