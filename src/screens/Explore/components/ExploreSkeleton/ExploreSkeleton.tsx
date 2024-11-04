import { StyleSheet } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

import { Sizes } from '../../ExploreScreen.constants';

export const ExploreHeroSkeleton = () => {
  return <Skeleton style={styles.hero} />;
};
export const ExploreMediumCardSkeleton = () => {
  return <Skeleton style={styles.mediumCard} />;
};
export const ExploreSmallCardSkeleton = () => {
  return <Skeleton style={styles.smallCard} />;
};
export const ExploreListSkeleton = () => {
  return (
    <>
      <Skeleton style={[styles.text, styles.textHeadline]} />
      <Skeleton style={[styles.text, styles.textShort]} />
      <Skeleton style={[styles.text, styles.mediumCard]} />
    </>
  );
};
export const ExploreTextSkeleton = () => {
  return (
    <>
      <Skeleton style={[styles.text, styles.textHeadline]} />
      <Skeleton style={[styles.text, styles.textMedium]} />
      <Skeleton style={[styles.text, styles.textShort]} />
    </>
  );
};

const styles = StyleSheet.create({
  hero: {
    height: Sizes.Hero.card,
    width: Sizes.Card.width,
  },
  mediumCard: {
    height: Sizes.Card.medium,
    width: Sizes.Card.width,
  },
  smallCard: {
    height: Sizes.Card.small,
    width: Sizes.Card.width,
  },
  textHeadline: {
    height: 20,
    width: 132,
  },
  text: {
    height: Sizes.Space.s1,
    marginVertical: Sizes.Space.third,
  },
  textShort: {
    width: 202,
  },
  textMedium: {
    width: 312,
  },
  textLong: {
    width: Sizes.Card.width,
  },
});
