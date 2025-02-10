import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';

import { NetworkIcon } from '@/components/NetworkIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';

import { useBrowser } from '@/hooks/useBrowser';

import { Sizes } from '../../EarnScreen.constants';

import loc from '/loc';

export const DefiDepositOptionsEmptyCarousel = () => {
  const { openURL } = useBrowser();

  const onOpenSupportArticle = () => openURL('https://kraken.com');

  return (
    <View style={styles.container}>
      <Card size="large">
        <View style={styles.cardContent}>
          <View style={styles.heading}>
            <NetworkIcon networkName="ethereum" size={24} />
            <Label type="boldTitle2" color="light100">
              {loc.earn.errors.emptyCarousel.heading}
            </Label>
          </View>

          <View style={styles.content}>
            <Label type="regularCaption1" color="light75">
              {loc.earn.errors.emptyCarousel.detail}
            </Label>

            <Touchable style={styles.supportArticle} onPress={onOpenSupportArticle}>
              <Label type="regularCaption1" color="light100">
                {loc.earn.errors.emptyCarousel.supportArticle}
              </Label>
              <SvgIcon name="open-external" size={14} />
            </Touchable>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Sizes.Carousel.height,
    marginHorizontal: Sizes.Space.s2,
  },
  cardContent: {
    height: '100%',
    gap: 16,
    justifyContent: 'center',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    gap: 4,
  },
  supportArticle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
