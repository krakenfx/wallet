import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  clearSearch: () => void;
};

export const EmptySearchResult = ({ clearSearch }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/common/search.png')} style={styles.image} />
      <Label style={styles.title} type="boldTitle0">
        {loc.swap.emptyState.searchEmptyTitle}
      </Label>
      <Label color="light75" type="regularBody" style={styles.desc}>
        {loc.swap.emptyState.searchEmptyDesc}
      </Label>
      <Button size="small" text={loc.swap.emptyState.clearSearch} onPress={clearSearch} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 100,
  },
  title: {
    marginVertical: 8,
    textAlign: 'center',
  },
  desc: {
    textAlign: 'center',
    marginHorizontal: 16,
  },
  image: {
    width: 140,
    height: 140,
  },
  button: {
    marginTop: 16,
  },
});
