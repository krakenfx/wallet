import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientPromoBackground } from '@/components/Gradients/GradientPromoBackground';
import { IconButton } from '@/components/IconButton/IconButton';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable/Touchable';
import { useKrakenConnectSettingsMutations } from '@/realm/krakenConnect/useKrakenConnectSettingsMutations';
import { Routes } from '@/Routes';

import loc from '/loc';

export const KrakenConnectFundCTA = () => {
  const navigation = useNavigation();
  const { setExchangeCtasHidden } = useKrakenConnectSettingsMutations();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const handleClose = () => {
    setExchangeCtasHidden();
    setDismissed(true);
  };

  if (dismissed) {
    return;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut.duration(100)}>
      <View style={styles.cardContainer}>
        <Touchable onPress={() => navigation.navigate(Routes.KrakenConnect)}>
          <View style={[styles.container]}>
            <GradientPromoBackground />
            <Image style={styles.image} source={require('@/assets/images/krakenConnect/fundWalletIllustration.png')} />
            <View style={styles.textContent}>
              <Label style={styles.headline} type="boldTitle0" numberOfLines={2}>
                {loc.krakenConnect.fundCta.heading}
              </Label>
              <Label type="promoBodyRegular" style={styles.body} color="light75">
                {loc.krakenConnect.fundCta.body}
              </Label>
              <Label type="promoBodyBold" style={styles.body} numberOfLines={2} color="light100">
                {loc.krakenConnect.fundCta.bodyBold} <SvgIcon style={styles.chevron} name="chevron-right" size={18} />
              </Label>
            </View>
          </View>
          <View style={styles.closeButtonContainer}>
            <IconButton name="close" onPress={handleClose} testID="CloseButton" style={styles.closeButton} />
          </View>
        </Touchable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    paddingVertical: 20,
  },
  textContent: {
    flexDirection: 'column',
    paddingStart: 10,
    flex: 1,
  },
  body: {
    overflow: 'hidden',
  },
  chevron: {
    transform: [{ translateY: Platform.OS === 'android' ? 4 : 2 }, { translateX: -6 }],
  },
  headline: {
    marginBottom: 8,
    marginRight: 40,
  },
  image: {
    resizeMode: 'contain',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 13,
    right: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
  },
});
