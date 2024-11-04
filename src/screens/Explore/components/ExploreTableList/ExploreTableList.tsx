import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

import { Sizes } from '../../ExploreScreen.constants';

import { ExploreTableListItem } from '../ExploreTableListItem/ExploreTableListItem';

import type { ExploreTableListProps } from './ExploreTableList.types';

const { Space } = Sizes;

export const ExploreTableList = ({ title, items = [], style }: ExploreTableListProps) => {
  return (
    <View style={style}>
      {title && (
        <Label style={styles.title} type="boldTitle2" color="light100">
          {title}
        </Label>
      )}
      <View style={styles.items}>
        <GradientItemBackground style={StyleSheet.absoluteFill} />
        {items.map((item, index) => {
          return (
            <ExploreTableListItem
              key={`${item.id}_${index}`}
              title={item.title}
              body={item.body}
              icon={item.icon}
              buttonText={item.buttonText}
              buttonLink={item.buttonLink}
              link={item.link}
              iconType={item.iconVariant}
            />
          );
        })}
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
