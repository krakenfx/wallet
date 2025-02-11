import { ScrollView, StyleSheet } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

export const DepositOptionsCarouselSkeleton = () => (
  <ScrollView style={styles.row} contentContainerStyle={styles.container} horizontal showsHorizontalScrollIndicator={false}>
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 48,
    marginHorizontal: -24,
  },
  row: {
    paddingRight: 48,
  },
  skeleton: {
    height: 156,
    width: 144,
    borderRadius: 24,
    overflow: 'hidden',
  },
});
