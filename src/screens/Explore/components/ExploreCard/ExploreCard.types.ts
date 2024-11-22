import type { StyleProp, ViewStyle } from 'react-native';

import type { ExploreCardSize, ExploreLink } from '@/api/types';

export type ExploreCardProps = {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
  link?: ExploreLink;
  size: ExploreCardSize;
  background: string;
  floatingIcon?: string;
  info?: string;
  style?: StyleProp<ViewStyle>;
};
