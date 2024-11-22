import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { Sizes } from '../../ExploreScreen.constants';

import { useExploreLink } from '../../hooks/useExploreLink';
import { ExploreCardContrastOverlay } from '../ExploreCardContrastOverlay/ExploreCardContrastOverlay';
import { ExploreText } from '../ExploreText';

import type { ExploreCardProps } from './ExploreCard.types';

const { Space, Card, FloatingIcon } = Sizes;

export const ExploreCard = ({ title, body, floatingIcon, link, background, size, info, style }: ExploreCardProps) => {
  const { colors } = useTheme();
  const themedShadow = { shadowColor: colors.dark25 };
  const handleExploreLink = useExploreLink(link);
  const cardStyle = styles[size];

  return (
    <Touchable onPress={handleExploreLink}>
      <View style={style}>
        <View style={[styles.container, themedShadow, cardStyle, style]}>
          <View style={[styles.image, cardStyle]}>
            <Image source={{ uri: background }} style={cardStyle} />
            <ExploreCardContrastOverlay width={cardStyle.width} height={cardStyle.height} />
          </View>
          {floatingIcon && <Image source={{ uri: floatingIcon }} style={styles.bleedImage} />}
          <View style={[styles.content, !!floatingIcon && styles.contentWithFloatingIcon]}>
            {(title || body) && <ExploreText title={title} titleLines={2} body={body} style={styles.text} bodyType="regularBody" bodyLines={3} />}
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
    flex: 0.75,
  },
  bleedImage: {
    position: 'absolute',
    top: -Space.s2,
    right: 0,
    width: FloatingIcon.width,
    height: FloatingIcon.height,
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
});
