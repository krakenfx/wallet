import { useNavigation } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';

import { CardImageCTA } from '@/components/CardImageCTA/CardImageCTA';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon/SvgIcon';
import { Routes } from '@/Routes';

import loc from '/loc';

export const KrakenConnectTransferCTA = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CardImageCTA
        onPress={() => {
          navigation.navigate(Routes.KrakenConnect);
        }}
        imagePosition="right"
        image={require('@/assets/images/transactions/zero_state_tx.png')}>
        <Label style={styles.headline} type="boldTitle1">
          {loc.krakenConnect.transferCta.heading}
        </Label>
        <Label type="regularBody">
          {loc.krakenConnect.transferCta.body}
          <SvgIcon style={styles.chevron} name="chevron-right" size={18} />
        </Label>
      </CardImageCTA>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headline: {
    marginBottom: 8,
  },
  chevron: {
    transform: [{ translateY: Platform.OS === 'android' ? 4 : 2 }],
  },
});
