import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Label } from '@/components/Label';

import { DepositOptionsCarouselCard } from './DepositOptionsCarouselCard';
import { DepositOptionsCarouselEmpty } from './DepositOptionsCarouselEmpty';
import { DepositOptionsCarouselSkeleton } from './DepositOptionsCarouselSkeleton';

import type { CardData } from './DepositOptionsCarousel.types';

const renderItem = ({ item }: { item: CardData }) => <DepositOptionsCarouselCard {...item} />;
const keyExtractor = (item: CardData, index: number) => item?.vaultAddress + '_' + index;

type Props = {
  caption?: string;
  cards?: CardData[];
  isLoading: boolean;
};

export const DepositOptionsCarouselUI = ({ caption, cards, isLoading }: Props) => {
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
            scrollEnabled
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
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
