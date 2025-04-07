import { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';

import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';

import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';

import { DefiAssetProtocolRow } from '../DefiAssetProtocolRow/DefiAssetProtocolRow';

import type { DefiEarnSheetListProps } from './DefiEarnSheetList.types';
import type { DefiProtocol } from '../DefiAssetProtocolRow/DefiAssetProtocolRow.types';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as FlatList;

export const DefiEarnSheetList = forwardRef<FlatList, DefiEarnSheetListProps>(({ protocols, isHeaderShrunk, scrollEnabled, closeEarnSheet }, ref) => {
  const listPaddingBottom = useBottomSheetPadding();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      const scrollOffset = contentOffset.y;

      if (scrollOffset > 10 && !isHeaderShrunk.value) {
        isHeaderShrunk.value = true;
      } else if (scrollOffset <= 10 && isHeaderShrunk.value) {
        isHeaderShrunk.value = false;
      }
    },
  });

  const renderItem = useCallback(
    ({ item, index }: { item: DefiProtocol; index: number }) => (
      <DefiAssetProtocolRow protocol={item} isFirst={index === 0} isLast={index === protocols.length - 1} closeEarnSheet={closeEarnSheet} />
    ),
    [protocols.length, closeEarnSheet],
  );

  return (
    <AnimatedFlatList
      ref={ref}
      data={protocols}
      style={styles.listContainer}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: listPaddingBottom }]}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      scrollEnabled={scrollEnabled}
      bounces={false}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparatorComponent}
      renderItem={renderItem}
    />
  );
});

const ItemSeparatorComponent = () => <View style={styles.divider} />;

const keyExtractor = (item: DefiProtocol, index: number) => `${item.name}-${index}`;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    marginTop: 8,
  },
  divider: {
    height: 1,
  },
});
