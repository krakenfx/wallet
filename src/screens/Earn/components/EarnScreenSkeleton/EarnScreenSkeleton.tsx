import { StyleSheet, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { DepositOptionsCarouselSkeleton } from '@/components/DepositOptionsCarousel/DepositOptionsCarouselSkeleton';
import { Skeleton } from '@/components/Skeleton';

import { Sizes } from '../../EarnScreen.constants';

export const HeroSkeleton = () => <Skeleton style={styles.hero} />;

export const DefiDepositOptionCarouselSkeleton = () => (
  <View style={styles.carouselContainer}>
    <Skeleton style={[styles.textMedium, styles.marginHorizontal]} />
    <DepositOptionsCarouselSkeleton />
  </View>
);

export const DefiAssetsListHeaderSkeleton = () => (
  <View style={styles.filtersContainer}>
    <Skeleton style={[styles.assetsTitleContainer, styles.text, styles.textHeadline]} />

    <ScrollView
      horizontal
      style={styles.networkFilterContainer}
      contentContainerStyle={styles.networkFilterContentContainer}
      showsHorizontalScrollIndicator={false}>
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} style={styles.filterPill} />
      ))}
    </ScrollView>
  </View>
);

export const DefiAssetRowSkeleton = () => (
  <View style={styles.assetsListItem}>
    <View style={styles.assetInfo}>
      <Skeleton style={styles.assetIconCircle} />

      <View style={styles.assetCopyContainer}>
        <Skeleton style={styles.textMedium} />
        <Skeleton style={styles.textSmall} />
      </View>
    </View>

    <Skeleton style={styles.assetButton} />
  </View>
);

const styles = StyleSheet.create({
  hero: {
    borderRadius: 24,
    marginHorizontal: Sizes.Space.s2,
    height: Sizes.Hero.height,
  },
  text: {
    height: Sizes.Space.s1,
  },
  carouselContainer: {
    gap: 16,
  },
  marginHorizontal: {
    marginHorizontal: Sizes.Space.s2,
  },
  filtersContainer: {
    gap: 16,
  },
  assetsTitleContainer: {
    marginHorizontal: Sizes.Space.s2,
  },
  networkFilterContainer: {
    maxHeight: 20,
  },
  networkFilterContentContainer: {
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: Sizes.Space.s2,
  },
  filterPill: {
    height: 20,
    width: 90,
  },
  assetsListItem: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.Space.s2,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetCopyContainer: {
    gap: 4,
  },
  assetButton: {
    height: 35,
    width: 60,
  },
  assetIconCircle: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  textHeadline: {
    height: 24,
    width: 132,
  },
  textMedium: {
    height: 16,
    width: 100,
  },
  textSmall: {
    height: 12,
    width: 130,
  },
});
