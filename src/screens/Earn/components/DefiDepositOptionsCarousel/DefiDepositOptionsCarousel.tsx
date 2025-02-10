import { StyleSheet, View } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';

import type { CardData } from '@/components/DepositOptionsCarousel/DepositOptionsCarousel.types';
import { DepositOptionsCarouselCard } from '@/components/DepositOptionsCarousel/DepositOptionsCarouselCard';
import { Label } from '@/components/Label';

import { useDepositOptionsCardDataQuery } from '@/reactQuery/hooks/earn/useDepositOptionsQuery';

import { useHandleCarouselError } from '../../context/EarnErrorsContext';
import { Sizes } from '../../EarnScreen.constants';

import { DefiDepositOptionsEmptyCarousel } from '../DefiDepositOptionsEmptyCarousel/DefiDepositOptionsEmptyCarousel';
import { DefiDepositOptionsCarouselError } from '../EarnScreenErroStates/EarnScreenErroStates';
import { DefiDepositOptionCarouselSkeleton } from '../EarnScreenSkeleton/EarnScreenSkeleton';

import loc from '/loc';

export const DefiDepositOptionsCarousel = () => {
  const { data: cards, isLoading, isPending, error } = useDepositOptionsCardDataQuery({ minimumBalanceThreshold: 1, maxVaultsPerAsset: 1 });

  useHandleCarouselError(error);

  if (isLoading || isPending) {
    return <DefiDepositOptionCarouselSkeleton />;
  }

  return (
    <View style={styles.container}>
      <Label type="boldTitle1" style={styles.label}>
        {loc.earn.earnOnYourAssets}
      </Label>

      {error ? (
        <DefiDepositOptionsCarouselError />
      ) : cards?.length ? (
        <FlatList
          data={cards}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.carouselWrapper}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <DefiDepositOptionsEmptyCarousel />
      )}
    </View>
  );
};

const renderItem = ({ item }: { item: CardData }) => <DepositOptionsCarouselCard {...item} />;
const keyExtractor = (item: CardData) => `${item.vaultAddress}-${item.assetAddress}`;

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  label: {
    paddingHorizontal: Sizes.Space.s2,
  },
  carouselWrapper: {
    gap: 8,
    paddingHorizontal: Sizes.Space.s2,
  },
});
