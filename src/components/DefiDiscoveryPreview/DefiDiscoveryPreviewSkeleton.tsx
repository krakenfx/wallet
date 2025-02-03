import { StyleSheet } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

export const DefiDiscoveryPreviewSkeleton = () => (
  <>
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
    <Skeleton style={styles.skeleton} />
  </>
);

const styles = StyleSheet.create({
  skeleton: {
    height: 154,
    width: 144,
    borderRadius: 24,
    overflow: 'hidden',
  },
});
