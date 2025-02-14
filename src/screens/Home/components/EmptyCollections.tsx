import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ListHeader } from '@/components/ListHeader/ListHeader';
import { Routes } from '@/Routes';

import loc from '/loc';

interface EmptyCollectionsProps {
  hasArchivedNfts: boolean;
  sticky?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
}

export const EmptyCollections = ({ hasArchivedNfts, sticky, headerStyle }: EmptyCollectionsProps) => {
  const navigation = useNavigation();
  const onViewAllNfts = useCallback(() => navigation.navigate(Routes.Nfts), [navigation]);

  const onCtaPress = useCallback(() => navigation.navigate(Routes.Earn), [navigation]);

  return (
    <View style={styles.container}>
      <ListHeader
        title={loc.home.collection}
        buttonText={hasArchivedNfts ? loc.home.collection_see_all : undefined}
        buttonTestID={hasArchivedNfts ? `CollectionViewAll${sticky ? '-Sticky' : ''}` : undefined}
        onButtonPress={onViewAllNfts}
        style={headerStyle}
      />
      <EmptyState description={loc.home.collectionEmpty} ctaLabel={loc.home.collectionEmptyCta} ctaOnPress={onCtaPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 16,
  },
});
