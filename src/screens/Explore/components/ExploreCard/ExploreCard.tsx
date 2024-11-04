import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';

import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { Sizes } from '../../ExploreScreen.constants';

import { useExploreLink } from '../../hooks/useExploreLink';
import { ExploreText } from '../ExploreText';

import type { ExploreCardProps } from './ExploreCard.types';

const { Space, Card, FloatingIcon } = Sizes;

export const ExploreCard = ({ title, body, floatingIcon, link, background, size, style }: ExploreCardProps) => {
  const { colors } = useTheme();
  const themedShadow = { shadowColor: colors.dark25 };
  const handleExploreLink = useExploreLink(link);
  return (
    <Touchable onPress={handleExploreLink}>
      <View style={style}>
        <View style={[styles.container, themedShadow, styles[size], style]}>
          <Image source={{ uri: background }} style={[styles.image, styles[size]]} />
          {floatingIcon && <Image source={{ uri: floatingIcon }} style={styles.bleedImage} />}
          <View style={[styles.content, !!floatingIcon && styles.contentWithFloatingIcon]}>
            {(title || body) && <ExploreText title={title} body={body} style={styles.text} />}
            {link && <Button text={link?.text} onPress={handleExploreLink} style={styles.button} />}
          </View>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: Space.s2,

    elevation: Space.s1,
  },
  button: {
    marginTop: Space.s1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Space.s2,
    paddingVertical: Space.s2 - 2,
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  text: {
    marginBottom: Space.s1,
  },
  contentWithFloatingIcon: {
    flex: 0.75,
  },
  bleedImage: {
    position: 'absolute',
    top: -Space.s2,
    right: 0,
    width: FloatingIcon.width,
    height: FloatingIcon.height,
  },
  image: { borderRadius: Space.s2 + Space.third, position: 'absolute', width: Card.width },
  Small: {
    height: Card.small,
  },
  Medium: {
    height: Card.medium,
  },
  Large: {
    height: Card.large,
  },
});
