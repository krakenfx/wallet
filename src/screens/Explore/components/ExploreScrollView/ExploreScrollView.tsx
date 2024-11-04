import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientScreenView } from '@/components/Gradients';

import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';

import { Sizes } from '../../ExploreScreen.constants';

import type { ExploreScrollViewProps } from './ExploreScrollView.types';

export const ExploreScrollView = ({ children, style }: ExploreScrollViewProps) => {
  const insets = useSafeAreaInsets();
  const paddingBottom = useBottomElementSpacing();
  return (
    <GradientScreenView insetHeaderHeight={false} testID="ExploreScrollView">
      <ScrollView style={styles.scroll} contentContainerStyle={[{ paddingTop: insets.top, paddingBottom: paddingBottom + Sizes.Space.s8 }, style]}>
        {children}
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
});
