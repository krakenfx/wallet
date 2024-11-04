import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Sizes } from '../../ExploreScreen.constants';

import type { ExploreRowProps } from './ExploreRow.types';

const { Space } = Sizes;

export const ExploreRow = ({ children, index = 0 }: ExploreRowProps) => {
  const delay = Math.min(index * 100, 1000);
  if (!children) {
    return null;
  }
  return (
    <Animated.View entering={FadeIn.duration(500).delay(delay)} exiting={FadeOut.duration(500).delay(delay)}>
      <View style={styles.row}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Space.s1,
    marginVertical: Space.s1,
    marginHorizontal: Space.s1,
  },
});
