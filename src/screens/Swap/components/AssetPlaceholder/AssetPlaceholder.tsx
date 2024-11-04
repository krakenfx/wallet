import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

export const AssetPlaceholer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Skeleton style={styles.icon} />
        <Skeleton style={styles.label} />
      </View>
      <View style={styles.right}>
        <Skeleton style={styles.valueTop} />
        <Skeleton style={styles.valueBottom} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  label: {
    height: 30,
    borderRadius: 8,
    minWidth: 125,
  },
  valueTop: {
    height: 18,
    width: 90,
    borderRadius: 8,
  },
  valueBottom: {
    height: 16,
    width: 70,
    borderRadius: 8,
  },
});
