import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';
import { Routes } from '@/Routes';

import loc from '/loc';

export const DepositOptionsCarouselEmpty = () => {
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.navigate(Routes.Earn), [navigation]);

  return (
    <View style={styles.container}>
      <Card onPress={onPress} size="large">
        <View style={styles.content}>
          <Image style={styles.image} source={require('@/assets/images/common/defi.webp')} />
          <Label type="boldDisplay3" style={styles.label} numberOfLines={2}>
            {loc.earn.earnWhileYouSleep}
          </Label>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    height: 120,
    width: 120,
  },
  label: {
    flex: 1,
    lineHeight: 34,
    paddingRight: 4,
  },
});
