import { ScrollView, StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';

import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';

import { Sizes } from '../../ExploreScreen.constants';

import type { ExploreScrollViewProps } from './ExploreScrollView.types';

export const ExploreScrollView = ({ children, style }: ExploreScrollViewProps) => {
  const paddingBottom = useBottomElementSpacing();
  return (
    <GradientScreenView testID="ExploreScrollView">
      <ScrollView style={styles.scroll} contentContainerStyle={[{ paddingBottom: paddingBottom + Sizes.Space.s8 }, style]}>
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
