import { Image, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon';

import { Sizes } from '../../EarnScreen.constants';

import loc from '/loc';

export const WholePageErrorScreen = () => {
  return (
    <View style={styles.marginHorizontal}>
      <View style={styles.wholePageErrorContainer}>
        <Image style={styles.image} source={require('@/assets/images/common/defi.webp')} />
        <View style={styles.copyView}>
          <Label type="boldTitle2" color="light75" style={styles.copy}>
            {loc.earn.errors.titlePlural}
          </Label>
          <Label type="regularCaption1" color="light50" style={styles.copy}>
            {loc.earn.errors.explaination}
          </Label>
        </View>
      </View>
    </View>
  );
};

export const DefiHighlightHeroError = () => {
  return (
    <View style={[styles.heroErrorContainer, styles.marginHorizontal]}>
      <Card size="large">
        <View style={styles.errorContent}>
          <SvgIcon size={64} name="earn" color="light75" />

          <View style={styles.copyView}>
            <Label type="boldTitle2" color="light75" style={styles.copy}>
              {loc.earn.errors.titleSingular}
            </Label>
            <Label type="regularCaption1" color="light50" style={styles.copy}>
              {loc.earn.errors.explaination}
            </Label>
          </View>
        </View>
      </Card>
    </View>
  );
};

export const DefiDepositOptionsCarouselError = () => {
  return (
    <View style={[styles.carouselErrorContainer, styles.marginHorizontal]}>
      <Card size="large">
        <View style={styles.errorContent}>
          <View style={styles.copyView}>
            <Label type="boldTitle2" color="light75" style={styles.copy}>
              {loc.earn.errors.titlePlural}
            </Label>
            <Label type="regularCaption1" color="light50" style={styles.copy}>
              {loc.earn.errors.explaination}
            </Label>
          </View>
        </View>
      </Card>
    </View>
  );
};

export const DefiAssetsListError = () => {
  return (
    <View style={styles.marginHorizontal}>
      <View style={styles.defiAssetsListContainer}>
        <Image style={styles.image} source={require('@/assets/images/common/defi.webp')} />
        <View style={styles.copyView}>
          <Label type="boldTitle2" color="light75" style={styles.copy}>
            {loc.earn.errors.titlePlural}
          </Label>
          <Label type="regularCaption1" color="light50" style={styles.copy}>
            {loc.earn.errors.explaination}
          </Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePageErrorContainer: {
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: Sizes.Space.s1,
    paddingTop: Sizes.Space.s8,
  },
  marginHorizontal: {
    marginHorizontal: Sizes.Space.s2,
  },
  heroErrorContainer: {
    height: Sizes.Hero.height,
  },
  carouselErrorContainer: {
    height: Sizes.Carousel.height,
  },
  defiAssetsListContainer: {
    gap: 16,
    alignItems: 'center',
    paddingVertical: Sizes.Space.s2,
    paddingHorizontal: Sizes.Space.s1,
  },
  errorContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 16,
  },
  copyView: {
    gap: 4,
  },
  copy: {
    textAlign: 'center',
  },
  image: {
    height: 120,
    width: 120,
  },
});
