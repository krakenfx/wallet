import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';

import { useExploreAnimationContext } from '../../context/ExploreAnimationContext';
import { Sizes } from '../../ExploreScreen.constants';
import { ExploreText } from '../ExploreText';

import { ExploreTableListItemProps } from './ExploreTableListItem.types';

const { Space, ListIcon } = Sizes;

export const ExploreTableListItem: React.FC<ExploreTableListItemProps> = ({
  title,
  body,
  buttonText,
  buttonLink,
  icon,
  iconType,
}: ExploreTableListItemProps) => {
  const { openLinkWithTransition } = useExploreAnimationContext();
  return (
    <View style={styles.container}>
      {icon && <Image style={[styles.icon, styles[iconType ?? 'RoudedCorners']]} source={{ uri: icon }} />}
      {(title || body) && <ExploreText style={styles.text} title={title} body={body} bodyColor="light50" bodyType="regularCaption1" />}
      {buttonText && (
        <Button
          text={buttonText}
          onPress={() => {
            if (buttonLink) {
              openLinkWithTransition(buttonLink);
            }
          }}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Space.half,
  },
  text: {
    flex: 1,
  },
  firstItem: {
    overflow: 'hidden',
  },
  lastItem: {
    overflow: 'hidden',
    paddingBottom: Space.s1,
    borderBottomLeftRadius: Space.s1,
    borderBottomRightRadius: Space.s1,
  },
  icon: {
    width: ListIcon.width,
    height: ListIcon.height,
    marginRight: Space.s1,
    flexShrink: 0,
  },
  button: {
    flexShrink: 0,
  },
  Square: { borderRadius: 0 },
  RoudedCorners: { borderRadius: Space.s1 },
  Circle: { borderRadius: ListIcon.width },
});
