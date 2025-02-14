import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

const AssetSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.left}>
      <Skeleton style={styles.assetIconCircle} />
      <Skeleton style={styles.assetButton} />
    </View>

    <View style={styles.right}>
      <Skeleton style={styles.textMedium} />
      <Skeleton style={styles.textSmall} />
    </View>
  </View>
);
const elements = Array(7).fill('');

export const AssetsSkeletons = () => {
  return (
    <View style={styles.assets}>
      {elements.map((_el, index) => (
        <AssetSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  assets: {
    gap: 6,
  },
  container: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assetIconCircle: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  textMedium: {
    height: 18,
    width: 86,
    borderRadius: 3,
  },
  textSmall: {
    height: 16,
    width: 65,
    borderRadius: 3,
  },
  assetButton: {
    height: 24,
    width: 118,
    borderRadius: 6,
  },
});
