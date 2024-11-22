import { type PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { ExploreContentRow } from '@/api/types';

import { useDynamicExploreContent } from '@/reactQuery/hooks/useDynamicExploreContent';

import { Sizes } from '../../ExploreScreen.constants';

import { ExploreCard } from '../ExploreCard';
import { ExploreHero } from '../ExploreHero';
import { ExploreRow } from '../ExploreRow';
import { PlaceholderSkeleton } from '../ExploreSkeleton';
import { ExploreTableList } from '../ExploreTableList';
import { ExploreText } from '../ExploreText';

const { Space } = Sizes;

const ContentWrapper = ({ marker, index, children }: PropsWithChildren<{ marker: string; index: number }>) => {
  return (
    <ExploreRow index={index}>
      <Animated.View key={marker} entering={FadeIn} exiting={FadeOut}>
        {children}
      </Animated.View>
    </ExploreRow>
  );
};

export const ExploreContent = ({ data, index = 0 }: { data: ExploreContentRow; index?: number }) => {
  const [rowData, setRowData] = useState<ExploreContentRow>(data);
  const { isSuccess, data: fetchedData } = useDynamicExploreContent(data?.id, data?.hasDynamicContent ?? false);
  const id = `${data?.id}_${rowData?.hasDynamicContent ? 'dynamic' : 'static'}`;

  useEffect(() => {
    if (isSuccess) {
      setRowData(fetchedData);
    }
  }, [isSuccess, fetchedData]);

  if (rowData?.hasDynamicContent) {
    return (
      <ContentWrapper marker={id} index={index}>
        <PlaceholderSkeleton data={rowData} />
      </ContentWrapper>
    );
  }

  if (rowData.content.length < 1) {
    return null;
  }

  switch (rowData.variant) {
    case 'Hero': {
      const [heroData] = rowData.content;
      return (
        <ContentWrapper marker={id} index={index}>
          <ExploreHero {...heroData} />
        </ContentWrapper>
      );
    }
    case 'Card': {
      const [cardData] = rowData.content;
      return (
        <ContentWrapper marker={id} index={index}>
          <ExploreCard {...cardData} />
        </ContentWrapper>
      );
    }
    case 'List': {
      const [listData] = rowData.content;
      return (
        <ContentWrapper marker={id} index={index}>
          <ExploreTableList {...listData} />
        </ContentWrapper>
      );
    }
    case 'Text': {
      const [textData] = rowData.content;
      return (
        <ContentWrapper marker={id} index={index}>
          <ExploreText {...textData} style={styles.textContent} />
        </ContentWrapper>
      );
    }
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  textContent: {
    paddingHorizontal: Space.s1,
  },
});
