import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import type { RealmNft } from '@/realm/nfts';
import { useNfts } from '@/realm/nfts';
import type { NavigationProps } from '@/Routes';
import { NftItem } from '@/screens/Nfts/components/NftItem';

export const HomeNFTGallery = () => {
  const navigation = useNavigation<NavigationProps<'Home'>['navigation']>();

  const nfts = useNfts();

  const nftsDatasource = useMemo(() => nfts.filter(n => n.inGallery), [nfts]);

  const renderItem = ({ item }: { item: RealmNft }) => <NftItem nft={item} navigation={navigation} />;

  if (nftsDatasource.length === 0) {
    return null;
  }

  const keyExtractor = (item: RealmNft) => item.assetId;
  return (
    <FlatList
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      renderItem={renderItem}
      data={nftsDatasource}
      extraData={nftsDatasource}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: -24,
  },
  contentContainer: {
    paddingLeft: 24,
    paddingRight: 16,
  },
});
