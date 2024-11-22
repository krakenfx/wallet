import type { StyleProp, ViewStyle } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import assert from 'assert';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import type { RealmNft } from '@/realm/nfts';
import { Routes } from '@/Routes';
import { getLabelsFromNft } from '@/screens/Nfts/utils';

import { getTokenIconFallbackProps } from '/generated/assetIcons';

interface NftCollectionBlockProps {
  nft: RealmNft | undefined;
  currentAccount: number;
  omitSecondaryLabel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  allowNavigationToNft?: boolean;
}

const IMG_SIZE = 72;

export const NftBlock = ({ nft, currentAccount, omitSecondaryLabel, containerStyle, allowNavigationToNft }: NftCollectionBlockProps) => {
  const navigation = useNavigation();
  const { primaryLabel, secondaryLabel } = getLabelsFromNft(nft);
  const showSecondaryLabel = !omitSecondaryLabel && secondaryLabel;
  const fallbackBackgroundColor = !nft?.metadata?.imageUrl && { backgroundColor: getTokenIconFallbackProps('NFT').backgroundColor };
  const isNftOwnedByWallet = nft && nft.wallet.accountIdx === currentAccount;
  const metadata = nft?.metadata;
  const canOpenNft = metadata && allowNavigationToNft && isNftOwnedByWallet;

  const handlePress = useCallback(() => {
    assert(metadata !== undefined, 'Unexpected error in NFTBlock handlePress, this should never happen');

    navigation.goBack();
    navigation.navigate(Routes.ViewNft, {
      assetId: metadata.assetId,
    });
  }, [navigation, metadata]);

  return (
    <Touchable disabled={!canOpenNft} onPress={handlePress}>
      <View style={[styles.collection, containerStyle]}>
        <GradientItemBackground />
        <View style={[styles.imageWrapper, fallbackBackgroundColor]}>
          {metadata?.imageUrl ? (
            <ImageSvg fallbackIconSize={45} uri={metadata.imageUrl} width={IMG_SIZE} height={IMG_SIZE} contentType={metadata.contentType} />
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
