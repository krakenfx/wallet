import { Image, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/themes';

import { Sizes } from '../../ExploreScreen.constants';
import { ExploreCardContrastOverlay } from '../ExploreCardContrastOverlay/ExploreCardContrastOverlay';
import { ExploreTableList } from '../ExploreTableList';
import { ExploreText } from '../ExploreText';

import type { ExploreHeroProps } from './ExploreHero.types';

const { Space, Card, Hero } = Sizes;

export const ExploreHero = ({ title, body, background, cta, variant, style }: ExploreHeroProps) => {
  const { colors } = useTheme();
  const isCard: boolean = variant === 'Card';
  const imageSizes = isCard ? styles.imageCard : styles.imageFullBleed;
  const themedShadow = isCard ? { shadowColor: colors.dark25 } : {};
  const variantStyle = isCard ? styles.Card : styles.FullBleed;

  return (
    <View style={style}>
      <View style={[styles.container, themedShadow, variantStyle, style]}>
        <View style={[styles.imageContainer, imageSizes, !isCard && styles.imageContainerFullbleed]}>
          <Image source={{ uri: background }} style={[styles.image, imageSizes]} />
          <ExploreCardContrastOverlay width={imageSizes.width} height={imageSizes.height} />
        </View>
        <View style={[styles.content, !isCard && styles.contentFullbleed]}>
          {(title || body) && (
            <ExploreText
              titleType="boldDisplay3"
              titleStyle={styles.centerText}
              title={title}
              titleLines={2}
              bodyType="regularBody"
              bodyStyle={[styles.centerText, { marginTop: Space.half, marginBottom: Space.s1 }]}
              body={body}
              bodyLines={3}
              style={styles.text}
            />
          )}
          {cta && <ExploreTableList items={[cta]} style={styles.cta} />}
        </View>
      </View>
    </View>
  );
};

export default ExploreHero;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
  },
  button: {
    marginTop: Space.s1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Space.s2,
    paddingVertical: Space.s2 - 2,
    alignSelf: 'flex-end',
    marginBottom: 0,
  },
  contentFullbleed: {
    marginBottom: Sizes.Space.s1,
  },
  imageContainer: { borderRadius: Space.s2 + Space.third, position: 'absolute', overflow: 'hidden' },
  imageContainerFullbleed: { top: -Space.s1 },
  image: { position: 'absolute', width: Card.width, height: Card.large },
  imageCard: {
    width: Card.width,
    height: Card.large,
  },
  imageFullBleed: {
    width: Card.fullBleed,
    height: Hero.fullBleed,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  text: {
    marginBottom: Space.s1,
  },
  centerText: {
    textAlign: 'center',
  },
  cta: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  Card: {
    width: Card.width,
    height: Card.large,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: Space.s2,

    elevation: Space.s1,
  },
  FullBleed: {
    marginHorizontal: -Space.s2,
    paddingHorizontal: Space.s1,
    width: Card.fullBleed,
    height: Hero.fullBleed,
  },
});
