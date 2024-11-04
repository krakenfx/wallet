import React from 'react';
import { View } from 'react-native';

import type { ExploreContentRow } from '@/api/types';

import { ExploreContent } from '../ExploreContent';
import { ExploreRow } from '../ExploreRow';
import { ExploreHeroSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton } from '../ExploreSkeleton';

import type { ExploreFeedProps } from './ExploreFeed.types';

const skeletons = [ExploreHeroSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton];

export const ExploreFeed = ({ feedData, loaded }: ExploreFeedProps) => {
  return (
    <View>
      {loaded && feedData.length > 0
        ? feedData.map((content: ExploreContentRow, index: number) => (
            <ExploreRow key={`${content.id}_${index}`} index={index}>
              <ExploreContent data={content} />
            </ExploreRow>
          ))
        : skeletons.map((Skeleton, index) => (
            <ExploreRow key={`skeleton_${index}`} index={index}>
              <Skeleton />
            </ExploreRow>
          ))}
    </View>
  );
};
