import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ExploreListItemContent } from '@/api/types';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

import { Sizes } from '../../ExploreScreen.constants';

import { ExploreTableListItem } from '../ExploreTableListItem/ExploreTableListItem';

import { ExploreTableListProps } from './ExploreTableList.types';

const { Space } = Sizes;

export const ExploreTableList: React.FC<ExploreTableListProps> = ({ title, items = [], style }: ExploreTableListProps) => {
  return (
    <View style={style}>
      {title && (
        <Label style={styles.title} type="boldTitle2" color="light100">
          {title}
        </Label>
      )}
      <View style={styles.items}>
        <GradientItemBackground style={StyleSheet.absoluteFill} />
        {items.map((item: ExploreListItemContent, index:number) => {
          return(
            <ExploreTableListItem
              key={`${item?.id}_${index}`}
              title={item?.title}
              body={item?.body}
              icon={item?.icon}
              buttonText={item?.buttonText}
              buttonLink={item?.buttonLink}
              iconType={item?.iconVariant}
            />
          )}
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  items: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: Space.s2 - Space.third,
    paddingVertical: Space.half,
    paddingHorizontal: Space.s1,
    width: '100%',
  },
});
