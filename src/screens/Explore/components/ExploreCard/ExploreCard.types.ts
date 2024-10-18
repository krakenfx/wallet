import { StyleProp, ViewStyle } from 'react-native';

import { ExploreCardSize } from '@/api/types';

export type ExploreCardProps = {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
  size: ExploreCardSize;
  background: string;
  floatingIcon?: string;
  style?: StyleProp<ViewStyle>;
};
