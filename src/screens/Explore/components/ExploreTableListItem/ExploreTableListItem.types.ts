import { ExploreListIconVariant } from '@/api/types';

export type ExploreTableListItemProps = {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: string;
  iconType?: ExploreListIconVariant;
};
