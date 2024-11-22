import { StyleSheet, View } from 'react-native';

import { ExploreRow } from '../ExploreRow';
import { ExploreHeroSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton } from '../ExploreSkeleton';

import { ExploreScrollView } from './ExploreScrollView';

import type { Meta, StoryObj } from '@storybook/react';

const ExploreScrollViewMeta: Meta<typeof ExploreScrollView> = {
  title: 'Explore/ExploreScrollView',
  component: ExploreScrollView,
  render: function Render() {
    return (
      <View style={[StyleSheet.absoluteFill]}>
        <ExploreScrollView>
          <ExploreRow>
            <ExploreHeroSkeleton />
          </ExploreRow>
          <ExploreRow>
            <ExploreListSkeleton />
          </ExploreRow>
          <ExploreRow>
            <ExploreTextSkeleton />
          </ExploreRow>
          <ExploreRow>
            <ExploreMediumCardSkeleton />
          </ExploreRow>
          <ExploreRow>
            <ExploreTextSkeleton />
          </ExploreRow>
        </ExploreScrollView>
      </View>
    );
  },
  decorators: [
    Story => (
      <>
        <Story />
      </>
    ),
  ],
};

export default ExploreScrollViewMeta;

export const Basic: StoryObj<typeof ExploreScrollView> = {};
