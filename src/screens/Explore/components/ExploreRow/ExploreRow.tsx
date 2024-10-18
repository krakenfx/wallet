import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Sizes } from '../../ExploreScreen.constants';

import { ExploreRowProps } from './ExploreRow.types';

const { Space } = Sizes;

export const ExploreRow: FC<ExploreRowProps> = ({ children, delay = 0, isFirst = false, isLast = false }: ExploreRowProps) => {
  if (!children) {
    return null;
  }
  return (
    <Animated.View entering={FadeIn.duration(500).delay(delay)} exiting={FadeOut.duration(500).delay(delay)}>
      <View style={[styles.row, isFirst && styles.first, isLast && styles.last]}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Space.s1,
    marginVertical: Space.s1,
    marginHorizontal: Space.s1,
  },
  first: {
    paddingTop: Space.s8,
  },
  last: {
    paddingBottom: Space.s6,
  },
});
