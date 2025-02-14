import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

export const KrakenConnectEmptyState = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.light2 }]}>
      <Image source={require('@/assets/images/krakenConnect/krakenConnectNoData.png')} style={styles.image} />
      <Label type="boldTitle1" style={styles.label}>
        {loc.krakenConnect.noData.title}
      </Label>
      <Label type="regularBody" color="light75" style={styles.label}>
        {loc.krakenConnect.noData.description}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginVertical: 12,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  image: {
    width: 150,
    height: 183,
    marginBottom: 2,
  },
  label: {
    marginVertical: 2,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
