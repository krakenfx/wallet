import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

type Props = { reverse?: boolean };

export const DefiDetailsHeaderNavSkeleton = ({ reverse }: Props) => (
  <View style={[styles.container, reverse && styles.containerReverse]}>
    <Skeleton style={styles.skeletonCircle} />
    <View style={styles.containerColumn}>
      <Skeleton style={styles.skeletonTop} />
      <Skeleton style={styles.skeletonBottom} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    alignItems: 'center',
  },
  containerReverse: {
    direction: 'rtl',
    flex: 0,
  },
  containerColumn: {
    gap: 6,
  },
  skeletonCircle: {
    height: 32,
    width: 32,
    borderRadius: 14,
  },
  skeletonTop: {
    height: 14,
    borderRadius: 12,
    width: 65,
  },
  skeletonBottom: {
    height: 10,
    borderRadius: 12,
    width: 40,
  },
});
