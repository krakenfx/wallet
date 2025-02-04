import { useNavigation } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';

import { CardImageCTA } from '@/components/CardImageCTA/CardImageCTA';
import { IconButton } from '@/components/IconButton/IconButton';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon';
import { Routes } from '@/Routes';

import loc from '/loc';

export const KrakenConnectFundCTA = () => {
  const navigation = useNavigation();
  const handleClose = () => {};
  return (
    <View style={styles.container}>
      <CardImageCTA
        style={styles.card}
        onPress={() => {
          navigation.navigate(Routes.KrakenConnect);
        }}
        image={require('@/assets/images/krakenConnect/FundIcons.png')}
        imageHight={95}
        imageWidth={82}
        imageStyle={styles.image}>
        <View style={styles.content}>
          <View style={styles.textContent}>
            <Label style={styles.headline} type="boldTitle1">
              {loc.krakenConnect.fundCta.heading}
            </Label>
            <Label type="regularBody">
              {loc.krakenConnect.fundCta.body} <SvgIcon style={styles.chevron} name="chevron-right" size={18} />
            </Label>
          </View>
          <View style={styles.closeButtonContainer}>
            <IconButton name="close" onPress={handleClose} testID="CloseButton" style={styles.closeButton} />
          </View>
        </View>
      </CardImageCTA>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    paddingVertical: 8,
  },
  textContent: {
    flexDirection: 'column',
  },
  chevron: {
    transform: [{ translateY: Platform.OS === 'android' ? 4 : 2 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headline: {
    marginBottom: 8,
  },
  image: {
    position: 'relative',
    left: -12,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: -8,
    right: 0,
  },
  closeButton: {
    width: 24,
    height: 24,
  },
});
