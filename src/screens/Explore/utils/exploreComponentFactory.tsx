import React from 'react';
import { StyleSheet } from 'react-native';

import { ExploreContentRow } from '@/api/types';

import { ExploreCard } from '../components/ExploreCard';
import { ExploreHero } from '../components/ExploreHero';
import { ExploreTableList } from '../components/ExploreTableList';
import { ExploreText } from '../components/ExploreText';
import { Sizes } from '../ExploreScreen.constants';

const { Space } = Sizes;

const styles = StyleSheet.create({
  textContent: {
    paddingHorizontal: Space.s1,
  },
});

export const renderExploreContent = (data: ExploreContentRow): React.ReactNode => {
  const isArray = Array.isArray(data?.content);
  const isEmpty = isArray ? data.content.length === 0 : false;
  if (isEmpty) {
    return null;
  }

  switch (data.variant) {
    case 'Hero': {
      const [heroData] = data.content;
      const { title: heroTitle, body: heroBody, cta, background: heroBackground, variant: type } = heroData;
      return <ExploreHero background={heroBackground} title={heroTitle} body={heroBody} cta={cta} type={type} />;
    }
    case 'Card': {
      const [cardData] = data.content;
      const { title: cardTitle, body: cardBody, floatingIcon, buttonText, buttonLink, background, size } = cardData;
      return (
        <ExploreCard
          background={background}
          title={cardTitle}
          body={cardBody}
          buttonText={buttonText}
          buttonLink={buttonLink}
          size={size}
          floatingIcon={floatingIcon}
        />
      );
    }
    case 'List': {
      const [listData] = data.content;
      const { title: listTitle, items } = listData;
      return <ExploreTableList title={listTitle} items={items} />;
    }
    case 'Text': {
      const [textData] = data.content;
      const { title: textTitle, body: textBody } = textData;
      return <ExploreText title={textTitle} body={textBody} style={styles.textContent} />;
    }
    default:
      return null;
  }
};
