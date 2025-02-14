import { useNavigation } from '@react-navigation/native';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground/GradientItemBackground';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon/SvgIcon';
import { Touchable } from '@/components/Touchable/Touchable';
import { Routes } from '@/Routes';

import loc from '/loc';

export const KrakenConnectTransferCTA = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Touchable
        onPress={() => {
          navigation.navigate(Routes.KrakenConnectLanding);
        }}>
        <View style={styles.card}>
          <GradientItemBackground />
          <View style={styles.content}>
            <View style={styles.text}>
              <Label style={styles.headline} type="boldTitle0" numberOfLines={1}>
                {loc.krakenConnect.transferCta.heading}
              </Label>
              <Label type="promoBodyRegular" numberOfLines={2} color="light75">
                {loc.krakenConnect.transferCta.body}
                <SvgIcon style={styles.chevron} name="chevron-right" size={18} />
              </Label>
            </View>
          </View>
          <Image style={styles.image} source={require('@/assets/images/transactions/zero_state_tx.png')} />
        </View>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    paddingTop: 8,
    paddingLeft: 24,
    paddingBottom: 8,
    paddingRight: 8,
  },
  text: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  headline: {
    marginBottom: 4,
  },
  content: {
    flexDirection: 'column',
    flex: 2,
  },
  chevron: {
    transform: [{ translateY: Platform.OS === 'android' ? 4 : 2 }],
  },
  image: {
    resizeMode: 'contain',
    width: 92,
    height: 92,
  },
});
