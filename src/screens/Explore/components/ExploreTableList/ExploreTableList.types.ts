import type { StyleProp, ViewStyle } from 'react-native';

import type { ExploreListItemContent } from '@/api/types';

export type ExploreTableListProps = {
  items: ExploreListItemContent[];
  title?: string;
  style?: StyleProp<ViewStyle>;
};
