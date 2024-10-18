import { StyleProp, ViewStyle } from 'react-native';

import { ExploreListItemContent } from '@/api/types';

export type ExploreTableListProps = {
  items: ExploreListItemContent[];
  title?: string;
  style?: StyleProp<ViewStyle>;
};
