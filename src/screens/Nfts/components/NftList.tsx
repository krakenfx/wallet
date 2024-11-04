import { useNavigation } from '@react-navigation/native';

import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { UINetworkFilter } from '@/components/NetworkFilter/types';
import type { RealmNft } from '@/realm/nfts';
import type { NavigationProps } from '@/Routes';

import { realmListToFlashListData } from '@/utils/realmListToFlashListData';

import { NFT_SIZE, NftItem } from './NftItem';
import { NftListEmptyState } from './NftListEmptyState';

import type { FlashListProps } from '@shopify/flash-list';

type Props = Pick<FlashListProps<RealmNft>, 'data' | 'refreshControl'> & {
  networkFilter?: UINetworkFilter[];
};

const keyExtractor = (item: RealmNft, i: number) => {
  if (!item?.isValid()) {
    return 'invalid_' + i;
  }

  return item.assetId;
};

export const NftList = ({ data, networkFilter, refreshControl }: Props) => {
  const navigation = useNavigation<NavigationProps<'Nfts'>['navigation']>();

  const renderItem = useCallback(
    ({ item }: { item: RealmNft }) => <NftItem nft={item} navigation={navigation} marginBottom={20} entering={FadeIn} exiting={FadeOut} />,
    [navigation],
  );

  const insets = useSafeAreaInsets();

  return (
    <FlashList
      data={realmListToFlashListData(data)}
      refreshControl={refreshControl}
      contentContainerStyle={StyleSheet.flatten([styles.contentContainer, { paddingBottom: insets.bottom }])}
      estimatedItemSize={NFT_SIZE}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={networkFilter ? <NftListEmptyState nftList="everything" networkFilter={networkFilter} /> : undefined}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
