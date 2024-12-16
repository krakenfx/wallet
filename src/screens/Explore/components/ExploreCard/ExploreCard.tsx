import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { Sizes } from '../../ExploreScreen.constants';

import { useExploreLink } from '../../hooks/useExploreLink';
import { ExploreCardContrastOverlay } from '../ExploreCardContrastOverlay/ExploreCardContrastOverlay';

import type { ExploreCardProps } from './ExploreCard.types';

const { Space, Card } = Sizes;

export const ExploreCard = ({ title, body, floatingIcon, link, background, size, info, style }: ExploreCardProps) => {
  const { colors } = useTheme();
  const themedShadow = { shadowColor: colors.dark25 };
  const handleExploreLink = useExploreLink(link);
  const cardStyle = styles[size];
  const titleLines = 2;
  const bodyLines = size === 'Small' ? 1 : 1;

  return (
    <Touchable onPress={handleExploreLink}>
      <View style={style}>
        <View style={[styles.container, themedShadow, cardStyle, style]}>
          <View style={[styles.image, cardStyle]}>
            <Image source={{ uri: background }} style={cardStyle} />
            <ExploreCardContrastOverlay width={cardStyle.width} height={cardStyle.height} />
          </View>
          {floatingIcon && <Image source={{ uri: floatingIcon }} style={styles.bleedImage} />}
          <View style={styles.content}>
            {title && (
              <Label
                type="boldTitle1"
                color="light100"
                style={[styles.shadow, !!floatingIcon && size !== 'Large' && styles.contentWithFloatingIcon]}
                numberOfLines={titleLines}>
                {title}
              </Label>
            )}
            {body && (
              <Label
                type="regularBody"
                color="light75"
                style={[styles.shadow, !!floatingIcon && size === 'Small' && styles.contentWithFloatingIcon]}
                numberOfLines={bodyLines}>
                {body}
              </Label>
            )}
            <View style={styles.footer}>
              {link && <Button text={link?.text} onPress={handleExploreLink} />}
              {info && (
                <Label style={styles.info} type="regularBody" numberOfLines={1}>
                  {info}
                </Label>
              )}
            </View>
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
  footer: {
    marginTop: Space.s1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.s1,
  },
  info: {
    flex: 1,
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
    maxWidth: '70%',
  },
  bleedImage: {
    position: 'absolute',
    top: -Space.s2,
    right: -Space.s1,
    width: (Card.width - Space.s3) / 2,
    aspectRatio: 1,
    overflow: 'visible',
  },
  image: { borderRadius: Space.s2 + Space.third, position: 'absolute', overflow: 'hidden' },
  Small: {
    width: Card.width,
    height: Card.small,
  },
  Medium: {
    width: Card.width,
    height: Card.medium,
  },
  Large: {
    width: Card.width,
    height: Card.large,
  },
  shadow: {
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 1,
  },
});
