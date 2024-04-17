import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { NftMetadata } from '@/realm/nftMetadata/schema';
import { useNftById } from '@/realm/nfts';
import { Routes } from '@/Routes';
import { getLabelsFromNft } from '@/screens/Nfts/utils';

import { GradientItemBackground } from './GradientItemBackground';
import { ImageSvg } from './ImageSvg';
import { Label } from './Label';
import { SvgIcon } from './SvgIcon';
import { Touchable } from './Touchable';

import { getTokenIconFallbackProps } from '/generated/assetIcons';

interface NftCollectionBlockProps {
  nft: { metadata: NftMetadata };
  omitSecondaryLabel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  allowNavigationToNft?: boolean;
}

const IMG_SIZE = 72;

export const NftBlock = ({ nft, omitSecondaryLabel, containerStyle, allowNavigationToNft }: NftCollectionBlockProps) => {
  const { primaryLabel, secondaryLabel } = getLabelsFromNft(nft);
  const showSecondaryLabel = !omitSecondaryLabel && secondaryLabel;
  const fallbackBackgroundColor = !nft.metadata.imageUrl && { backgroundColor: getTokenIconFallbackProps('NFT').backgroundColor };
  const realmNft = useNftById(nft.metadata.assetId);
  const currentAccount = useCurrentAccountNumber();

  const isNftOwnedByWallet = realmNft && realmNft.wallet.accountIdx === currentAccount;

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.goBack();
    navigation.navigate(Routes.ViewNft, {
      assetId: nft.metadata.assetId,
    });
  };

  const canOpenNft = allowNavigationToNft && isNftOwnedByWallet;

  return (
    <Touchable disabled={!canOpenNft} onPress={handlePress}>
      <View style={[styles.collection, containerStyle]}>
        <GradientItemBackground />
        <View style={[styles.imageWrapper, fallbackBackgroundColor]}>
          {nft.metadata.imageUrl ? (
            <ImageSvg fallbackIconSize={45} uri={nft.metadata.imageUrl} width={IMG_SIZE} height={IMG_SIZE} contentType={nft.metadata.contentType} />
          ) : (
            <Label type="boldTitle0">NFT</Label>
          )}
        </View>
        <View style={styles.label}>
          {primaryLabel && (
            <Label type={showSecondaryLabel ? 'boldTitle2' : 'boldTitle0'} numberOfLines={1}>
              {primaryLabel}
            </Label>
          )}
          {showSecondaryLabel && (
            <Label type="boldCaption1" color="light50">
              {secondaryLabel}
            </Label>
          )}
        </View>
        {canOpenNft && <SvgIcon name="chevron-right" color="light75" />}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  collection: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    width: IMG_SIZE,
    height: IMG_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    overflow: 'hidden',
  },
});
