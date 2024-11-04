import { StyleSheet } from 'react-native';

import type { ExploreContentRow } from '@/api/types';

import { Sizes } from '../../ExploreScreen.constants';

import { ExploreCard } from '../ExploreCard';
import { ExploreHero } from '../ExploreHero';
import { ExploreTableList } from '../ExploreTableList';
import { ExploreText } from '../ExploreText';

const { Space } = Sizes;

export const ExploreContent = ({ data }: { data: ExploreContentRow }) => {
  switch (data.variant) {
    case 'Hero': {
      const [heroData] = data.content;
      return <ExploreHero {...heroData} />;
    }
    case 'Card': {
      const [cardData] = data.content;
      return <ExploreCard {...cardData} />;
    }
    case 'List': {
      const [listData] = data.content;
      return <ExploreTableList {...listData} />;
    }
    case 'Text': {
      const [textData] = data.content;
      return <ExploreText {...textData} style={styles.textContent} />;
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