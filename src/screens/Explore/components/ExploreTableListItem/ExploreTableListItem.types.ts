import type { ExploreLink, ExploreListIconVariant } from '@/api/types';

export type ExploreTableListItemProps = {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
  link?: ExploreLink;
  icon?: string;
  iconType?: ExploreListIconVariant;
};
