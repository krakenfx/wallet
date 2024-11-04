import type { StyleProp, ViewStyle } from 'react-native';

import type { ExploreHeroVariant, ExploreListItemContent } from '@/api/types';

export type ExploreHeroProps = {
  variant: ExploreHeroVariant;
  title: string;
  body?: string;
  background: string;
  cta?: ExploreListItemContent;
  style?: StyleProp<ViewStyle>;
};
