import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

export const DefiDetailsHeaderSkeleton = () => (
  <View style={styles.container}>
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeletonSmall} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    gap: 14,
  },
  skeleton: {
    height: 90,
    borderRadius: 24,
    overflow: 'hidden',
    width: '90%',
  },
  skeletonSmall: {
    height: 32,
    borderRadius: 24,
    overflow: 'hidden',
    width: '50%',
  },
});
