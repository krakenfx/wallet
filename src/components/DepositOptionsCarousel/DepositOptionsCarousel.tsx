import { Fragment } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import { useDepositOptionsCardDataQuery } from '@/reactQuery/hooks/earn/useDepositOptionsQuery';

import { DepositOptionsCarouselCard } from './DepositOptionsCarouselCard';
import { DepositOptionsCarouselEmpty } from './DepositOptionsCarouselEmpty';
import { DepositOptionsCarouselSkeleton } from './DepositOptionsCarouselSkeleton';

import type { CardData } from './DepositOptionsCarousel.types';

type Props = { caption?: string };

const renderItem = ({ item }: { item: CardData }) => <DepositOptionsCarouselCard {...item} />;
const keyExtractor = (item: CardData) => item?.vaultAddress;

export const DepositOptionsCarousel = ({ caption }: Props) => {
  const { data: cards, isLoading } = useDepositOptionsCardDataQuery({ minimumBalanceThreshold: 0, maxVaultsPerAsset: 1 });

  return (
    <Fragment>
      <View style={styles.container}>
        {isLoading ? (
          <DepositOptionsCarouselSkeleton />
        ) : cards?.length ? (
          <FlatList
            data={cards}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.contentContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <DepositOptionsCarouselEmpty />
        )}
      </View>
      {caption && (
        <Label type="regularCaption1" color="light50" style={styles.caption}>
          {caption}
        </Label>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: -24,
  },
  contentContainer: {
    gap: 8,
    paddingHorizontal: 24,
  },
  caption: {
    paddingTop: 16,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});
