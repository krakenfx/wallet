import { StyleProp, ViewStyle } from 'react-native';

import { ExploreHeroVariant, ExploreListItemContent } from '@/api/types';

export type ExploreHeroProps = {
  type: ExploreHeroVariant;
  title: string;
  body?: string;
  background: string;
  cta?: ExploreListItemContent;
  style?: StyleProp<ViewStyle>;
};
