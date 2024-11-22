import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import type { RealmNft } from '@/realm/nfts';

type Props = {
  nft: RealmNft;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  size?: number;
};

export const NftCollectionDetails: React.FC<Props> = ({ nft, label, size = 40, containerStyle }) => {
  const displayedLabel = label ?? nft.metadata.collectionName;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!nft.metadata.collectionImageUrl && (
        <MaskedElementWithCoin
          maskedElement={<ImageSvg uri={nft.metadata.collectionImageUrl} width={size} height={size} />}
          coinType={nft.wallet?.type}
          size={size}
          coinSize={16}
          style={styles.image}
          testID="NftCollectionDetailsNftIcon"
        />
      )}
      {displayedLabel && (
        <Label style={styles.flex} testID="NftCollectionDetailsDisplayName">
          {displayedLabel}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  image: {
    marginRight: 8,
  },
});
