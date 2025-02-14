import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ListHeader } from '@/components/ListHeader';
import { Routes } from '@/Routes';

import loc from '/loc';

export const DefiEmptyPositions = () => {
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.navigate(Routes.Earn), [navigation]);

  return (
    <View style={styles.defiEmpty}>
      <ListHeader title={loc.home.defiEmptyTitle} />
      <EmptyState description={loc.home.defiEmptyCaption} ctaLabel={loc.home.defiEmptyCta} ctaOnPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  defiEmpty: {
    gap: 16,
    marginBottom: 16,
  },
});
