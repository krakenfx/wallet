import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/themes';

import { Sizes } from '../../ExploreScreen.constants';
import { ExploreTableList } from '../ExploreTableList';
import { ExploreText } from '../ExploreText';

import { ExploreHeroProps } from './ExploreHero.types';

const { Space, Card, Hero } = Sizes;

export const ExploreHero: React.FC<ExploreHeroProps> = ({ title, body, background, cta, type, style }: ExploreHeroProps) => {
  const { colors } = useTheme();
  const isCard: boolean = type === 'Card';
  const imageSizes = isCard ? styles.imageCard : styles.imageFullBleed;
  const themedShadow = isCard ? { shadowColor: colors.dark25 } : {};
  return (
    <View style={style}>
      <View style={[styles.container, themedShadow, styles[type], style]}>
        <Image source={{ uri: background }} style={[styles.image, imageSizes]} />
        <View style={[styles.content]}>
          {(title || body) && (
            <ExploreText
              titleType="boldDisplay3"
              titleStyle={styles.centerText}
              title={title}
              bodyType="regularBody"
              bodyStyle={[styles.centerText, { marginTop: Space.half, marginBottom: Space.s1 }]}
              body={body}
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
  image: { borderRadius: Space.s2 + Space.third, position: 'absolute', width: Card.width, height: Card.large },
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
