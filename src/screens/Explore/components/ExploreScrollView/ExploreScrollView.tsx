import { ScrollView, StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';

import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';

import { Sizes } from '../../ExploreScreen.constants';

import type { ExploreScrollViewProps } from './ExploreScrollView.types';

export const ExploreScrollView = ({ children, style, insetHeaderHeight = true }: ExploreScrollViewProps) => {
  const paddingBottom = useBottomElementSpacing();
  return (
    <GradientScreenView insetHeaderHeight={insetHeaderHeight} testID="ExploreScreen">
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
