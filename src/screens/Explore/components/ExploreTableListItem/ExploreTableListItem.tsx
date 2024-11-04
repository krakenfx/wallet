import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';

import { Touchable } from '@/components/Touchable';

import { Sizes } from '../../ExploreScreen.constants';
import { useExploreLink } from '../../hooks/useExploreLink';
import { ExploreText } from '../ExploreText';

import type { ExploreTableListItemProps } from './ExploreTableListItem.types';

const { Space, ListIcon } = Sizes;

export const ExploreTableListItem = ({ title, body, link, icon, iconType }: ExploreTableListItemProps) => {
  const handleExploreLink = useExploreLink(link);

  return (
    <Touchable onPress={handleExploreLink}>
      <View style={styles.container}>
        {icon && <Image style={[styles.icon, styles[iconType ?? 'RoudedCorners']]} source={{ uri: icon }} />}
        {(title || body) && <ExploreText style={styles.text} title={title} body={body} bodyColor="light50" bodyType="regularCaption1" />}
        {link && <Button text={link?.text} onPress={handleExploreLink} style={styles.button} />}
      </View>
    </Touchable>
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
